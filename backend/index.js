require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const { MissingCaptchaToken, Unauthorized } = require('bmw/src/errors');
const BMWClient = require('bmw/src/bmw');
let bmwClient = new BMWClient();

const cors = require('cors');

const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8091',
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const vinTimersMap = new Map();

function createTimerObject() {
    return {
        startTimerObj: {
            timer: null,
            delay: null,
            timeSet: null
        },
        stopTimerObj: {
            timer: null,
            delay: null,
            timeSet: null
        }
    };
}

async function getFullVin(vin) {
    const vehicleDetails = await bmwClient.vehicles(vin);
    return vehicleDetails[0]?.vin;
}

// Helper function to convert hh:mm to milliseconds from now
function calculateDelay(hhmm) {
    const [hours, minutes] = hhmm.split(':').map(Number);
    const now = new Date();
    const targetTime = new Date(now);
    targetTime.setHours(hours, minutes, 0, 0); // Set the target time for today

    // If target time is in the past, set it for tomorrow
    if (targetTime < now) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    return targetTime - now; // Return delay in milliseconds
}

function clearTimerIfNeeded(timerObj) {
    if (timerObj) {
        if (timerObj.timer) {
            clearTimeout(timerObj.timer);
            timerObj.timer = null;
            console.log('Timer cleared');
        }
        timerObj.delay = null;
        timerObj.timeSet = null;
    }
}

async function fetchFullVin(vin) {
    if (!vin) {
        return { error: { status: 400, message: 'VIN is required' } };
    }

    let fullVin;
    try {
        fullVin = await getFullVin(vin);
    } catch (error) {
        return { error: { status: 500, message: `Failed to retrieve VIN: ${vin}` } };
    }

    if (!fullVin) {
        return { error: { status: 404, message: 'VIN not found' } };
    }

    return { fullVin };
}

function genericErrorHandling(error) {
    if (error instanceof MissingCaptchaToken) {
        return { status: 401, message: 'Missing hCaptcha token' };
    } else if (error instanceof Unauthorized) {
        return { status: 401, message: 'Unauthorized' };
    } else {
        return null;
    }
}

app.post('/login', async (req, res) => {
    const { hcaptchatoken } = req.body;

    if (!hcaptchatoken) {
        return res.status(400).json({ error: 'hcaptchatoken is required to relogin' });
    }

    try {
        bmwClient = new BMWClient(null, null, null, hcaptchatoken);
        bmwClient.bmwClientAPI.resetCache();
        await bmwClient.login();

        res.json({ message: 'Login successful' });
    } catch (error) {
        const genericError = genericErrorHandling(error);
        if (genericError) {
            return res.status(genericError.status).json({ error: genericError.message });
        }
        res.status(500).json({ error: 'Failed to login' });
    }
});

function validateTimerInput({ startTime, stopTime, vin }) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!vin) {
        return { valid: false, error: 'VIN is required' };
    }

    if (!startTime && !stopTime) {
        return { valid: false, error: 'At least start or stop time must be provided' };
    }

    if (startTime && !timeRegex.test(startTime)) {
        return { valid: false, error: 'Invalid start time format (expected hh:mm)' };
    }

    if (stopTime && !timeRegex.test(stopTime)) {
        return { valid: false, error: 'Invalid stop time format (expected hh:mm)' };
    }

    return { valid: true };
}

app.post('/setTimers', async (req, res) => {
    const { startTime, stopTime, vin } = req.body;

    const validation = validateTimerInput({ startTime, stopTime, vin });

    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    const vinFetchResult = await fetchFullVin(vin);
    if (vinFetchResult.error) {
        return res.status(vinFetchResult.error.status).json({ error: vinFetchResult.error.message });
    }
    const { fullVin } = vinFetchResult;

    let timers = vinTimersMap.get(fullVin);
    if (!timers) {
        timers = createTimerObject();
        vinTimersMap.set(fullVin, timers);
    }

    const { startTimerObj, stopTimerObj } = timers;

    clearTimerIfNeeded(startTimerObj);
    clearTimerIfNeeded(stopTimerObj);

    if (startTime) {
        startTimerObj.delay = calculateDelay(startTime);
    }
    if (stopTime) {
        stopTimerObj.delay = calculateDelay(stopTime);
    }

    if (startTime && stopTime && stopTimerObj.delay <= startTimerObj.delay) {
        return res.status(400).json({ error: 'Start time must be before stop time' });
    }

    if (startTimerObj.delay) {
        startTimerObj.timeSet = startTime;

        startTimerObj.timer = setTimeout(async () => {
            console.log(`Start timer triggered: Starting charging for VIN: ${fullVin}`);
            try {
                await bmwClient.startCharging(fullVin);
                console.log(`Charging started for vehicle with VIN: ${fullVin}`);
            } catch (error) {
                console.error(`Error starting charging for VIN: ${fullVin}:`, error);
                clearTimerIfNeeded(stopTimerObj);
            }

            clearTimerIfNeeded(startTimerObj);

            if (!startTime.delay) {
                vinTimersMap.delete(fullVin);
            }
        }, startTimerObj.delay);
    }

    if (stopTimerObj.delay) {
        stopTimerObj.timeSet = stopTime;

        stopTimerObj.timer = setTimeout(async () => {
            console.log(`Stop timer triggered: Stopping charging for VIN: ${fullVin}`);
            try {
                await bmwClient.stopCharging(fullVin);
                console.log(`Charging stopped for vehicle with VIN: ${fullVin}`);
            } catch (error) {
                console.error(`Error stopping charging for VIN: ${fullVin}:`, error);
            }

            clearTimerIfNeeded(stopTimerObj);

            vinTimersMap.delete(fullVin);
        }, stopTimerObj.delay);
    }

    const result = {
        message: 'Timers set successfully',
        vin: fullVin,
        startDelay: startTimerObj?.delay,
        stopDelay: stopTimerObj?.delay
    };

    console.log(`Timers set result:`, result);

    res.json({ message: 'Timers set successfully', ...result });
});

app.post('/clearTimers', async (req, res) => {
    const { vin } = req.body;

    if (!vin) {
        return res.status(400).json({ error: 'VIN is required to clear timers' });
    }

    const vinFetchResult = await fetchFullVin(vin);
    if (vinFetchResult.error) {
        return res.status(vinFetchResult.error.status).json({ error: vinFetchResult.error.message });
    }
    const { fullVin } = vinFetchResult;

    const timers = vinTimersMap.get(fullVin);
    if (!timers) {
        return res.status(404).json({ error: 'No timers found for this VIN' });
    }

    const { startTimerObj, stopTimerObj } = timers;

    clearTimerIfNeeded(startTimerObj);
    clearTimerIfNeeded(stopTimerObj);

    vinTimersMap.delete(fullVin);

    res.json({ message: `Timers cleared for VIN: ${fullVin}` });
});

app.post('/startCharging', async (req, res) => {
    const { vin } = req.body;

    if (!vin) {
        return res.status(400).json({ error: 'VIN is required to start charging' });
    }

    const vinFetchResult = await fetchFullVin(vin);
    if (vinFetchResult.error) {
        return res.status(vinFetchResult.error.status).json({ error: vinFetchResult.error.message });
    }
    const { fullVin } = vinFetchResult;

    try {
        await bmwClient.startCharging(fullVin);
        console.log(`Charging started for vehicle with VIN: ${fullVin}`);
        res.json({ message: 'Charging started successfully' });
    } catch (error) {
        console.error(`Error starting charging for VIN: ${fullVin}:`, error);
        res.status(500).json({ error: 'Failed to start charging' });
    }
});

app.post('/stopCharging', async (req, res) => {
    const { vin } = req.body;

    if (!vin) {
        return res.status(400).json({ error: 'VIN is required to stop charging' });
    }

    const vinFetchResult = await fetchFullVin(vin);
    if (vinFetchResult.error) {
        return res.status(vinFetchResult.error.status).json({ error: vinFetchResult.error.message });
    }
    const { fullVin } = vinFetchResult;

    try {
        await bmwClient.stopCharging(fullVin);
        console.log(`Charging stopped for vehicle with VIN: ${fullVin}`);
        res.json({ message: 'Charging stopped successfully' });
    } catch (error) {
        console.error(`Error stopping charging for VIN: ${fullVin}:`, error);
        res.status(500).json({ error: 'Failed to stop charging' });
    }
});

app.get('/getTimers', async (req, res) => {
    const { vin } = req.query;

    if (!vin) {
        return res.status(400).json({ error: 'VIN is required to get timers' });
    }

    const vinFetchResult = await fetchFullVin(vin);
    if (vinFetchResult.error) {
        return res.status(vinFetchResult.error.status).json({ error: vinFetchResult.error.message });
    }
    const { fullVin } = vinFetchResult;

    const timers = vinTimersMap.get(fullVin);
    if (!timers) {
        return res.json({ message: 'No timers are currently set for this VIN.' });
    }

    const { startTimerObj, stopTimerObj } = timers;

    const currentTime = Date.now();
    const startTimerRemaining = startTimerObj.timer ? Math.max(0, startTimerObj.delay - (currentTime - new Date().getTime())) : null;
    const stopTimerRemaining = stopTimerObj.timer ? Math.max(0, stopTimerObj.delay - (currentTime - new Date().getTime())) : null;

    res.json({
        message: `Timers are currently set for VIN: ${fullVin}.`,
        startTime: startTimerObj.timeSet,
        stopTime: stopTimerObj.timeSet,
        startTimerRemaining: startTimerRemaining ? `${Math.floor(startTimerRemaining / 1000)} seconds remaining` : 'N/A',
        stopTimerRemaining: stopTimerRemaining ? `${Math.floor(stopTimerRemaining / 1000)} seconds remaining` : 'N/A'
    });
});

app.get('/vehicleStatus', async (req, res) => {
    const { vin } = req.query;

    if (!vin) {
        return res.status(400).json({ error: 'VIN is required to check car status' });
    }

    try {
        const vehicleDetails = await bmwClient.vehicleDetails(vin, false);

        const vehicleState = vehicleDetails[0]?.state;
        const electricChargingState = vehicleState?.electricChargingState;

        const status = {
            isConnected: electricChargingState?.isChargerConnected || false,
            isCharging: electricChargingState?.chargingStatus === 'CHARGING' || false,
            chargingLevelPercent: electricChargingState?.chargingLevelPercent || null,
            range: vehicleState?.range || null,
            chargingTarget: electricChargingState?.chargingTarget || null
        };

        const message = status.isCharging
            ? 'Car is charging'
            : (status.isConnected ? 'Car is connected but not charging' : 'Car is not connected');

        res.json({ message, status });
    } catch (error) {
        const genericError = genericErrorHandling(error);
        if (genericError) {
            return res.status(genericError.status).json({ error: genericError.message });
        }
        console.error(`Error retrieving car status for VIN: ${vin}:`, error);
        res.status(500).json({ error: `Failed to retrieve car status for VIN: ${vin}` });
    }
});

app.get('/vehicleImages', async (req, res) => {
    const { vin, view } = req.query;

    if (!vin || !view) {
        return res.status(400).json({ error: 'VIN and view are required to retrieve the vehicle image' });
    }

    const vinFetchResult = await fetchFullVin(vin);
    if (vinFetchResult.error) {
        return res.status(vinFetchResult.error.status).json({ error: vinFetchResult.error.message });
    }
    const { fullVin } = vinFetchResult;

    try {
        // The client does not expose convenience methods to get vehicle images but it can
        // be found by using the internal API
        const vehicles = await bmwClient.vehicles(fullVin);

        for (const vehicle of vehicles) {
            const imageBuffer = await bmwClient.bmwClientAPI.vehicleImages(vehicle.vin, view);

            if (imageBuffer) {
                res.set('Cache-Control', 'public, max-age=86400, must-revalidate');
                res.set('Content-Type', 'image/png');
                return res.send(Buffer.from(imageBuffer));
            }
        }

        res.status(500).json({ error: 'Unable to find the image' });
    } catch (error) {
        console.error(`Error fetching vehicle image for VIN: ${fullVin}:`, error);
        res.status(500).json({ error: 'Failed to retrieve vehicle image' });
    }
});

app.listen(port, () => {
    console.log(`Timer API running on http://localhost:${port}`);
});
