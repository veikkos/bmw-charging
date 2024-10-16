require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const BMWClient = require('bmw/src/bmw');
const bmwClient = new BMWClient();

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
    if (timerObj.timer) {
        clearTimeout(timerObj.timer);
        timerObj.timer = null;
        timerObj.delay = null;
        timerObj.timeSet = null;
        console.log('Timer cleared.');
    }
}

app.post('/setTimers', (req, res) => {
    const { startTime, stopTime, vin } = req.body;

    if (!startTime || !stopTime || !vin) {
        return res.status(400).json({ error: 'Start time, stop time, and VIN are required' });
    }

    let timers = vinTimersMap.get(vin);
    if (!timers) {
        timers = createTimerObject();
        vinTimersMap.set(vin, timers);
    }

    const { startTimerObj, stopTimerObj } = timers;

    startTimerObj.delay = calculateDelay(startTime);
    stopTimerObj.delay = calculateDelay(stopTime);

    if (stopTimerObj.delay <= startTimerObj.delay) {
        return res.status(400).json({ error: 'Start time must be before stop time' });
    }

    clearTimerIfNeeded(startTimerObj);
    clearTimerIfNeeded(stopTimerObj);

    startTimerObj.timeSet = startTime;
    stopTimerObj.timeSet = stopTime;

    startTimerObj.timer = setTimeout(async () => {
        console.log(`Start timer triggered: Starting charging for VIN: ${vin}`);
        try {
            await bmwClient.startCharging(vin);
            console.log(`Charging started for vehicle with VIN: ${vin}`);
        } catch (error) {
            console.error(`Error starting charging for VIN: ${vin}:`, error);
            clearTimerIfNeeded(stopTimerObj);
        }

        clearTimerIfNeeded(startTimerObj);
    }, startTimerObj.delay);

    stopTimerObj.timer = setTimeout(async () => {
        console.log(`Stop timer triggered: Stopping charging for VIN: ${vin}`);
        try {
            await bmwClient.stopCharging(vin);
            console.log(`Charging stopped for vehicle with VIN: ${vin}`);
        } catch (error) {
            console.error(`Error stopping charging for VIN: ${vin}:`, error);
        }

        clearTimerIfNeeded(stopTimerObj);
        vinTimersMap.delete(vin);
    }, stopTimerObj.delay);

    console.log(`Timers set for VIN ${vin}: Start in ${startTimerObj.delay / 1000} s, Stop in ${stopTimerObj.delay / 1000} s`);

    res.json({ message: 'Timers set successfully', vin, startDelay: startTimerObj.delay, stopDelay: stopTimerObj.delay });
});

app.post('/clearTimers', (req, res) => {
    const { vin } = req.body;

    if (!vin) {
        return res.status(400).json({ error: 'VIN is required to clear timers' });
    }

    const timers = vinTimersMap.get(vin);
    if (!timers) {
        return res.status(404).json({ error: 'No timers found for this VIN' });
    }

    const { startTimerObj, stopTimerObj } = timers;

    clearTimerIfNeeded(startTimerObj);
    clearTimerIfNeeded(stopTimerObj);

    vinTimersMap.delete(vin);

    res.json({ message: `Timers cleared for VIN: ${vin}` });
});

app.post('/startCharging', async (req, res) => {
    const { vin } = req.body;

    if (!vin) {
        return res.status(400).json({ error: 'VIN is required to start charging' });
    }

    try {
        await bmwClient.startCharging(vin);
        console.log(`Charging started for vehicle with VIN: ${vin}`);
        res.json({ message: 'Charging started successfully' });
    } catch (error) {
        console.error('Error starting charging:', error);
        res.status(500).json({ error: 'Failed to start charging' });
    }
});

app.post('/stopCharging', async (req, res) => {
    const { vin } = req.body;

    if (!vin) {
        return res.status(400).json({ error: 'VIN is required to stop charging' });
    }

    try {
        await bmwClient.stopCharging(vin);
        console.log(`Charging stopped for vehicle with VIN: ${vin}`);
        res.json({ message: 'Charging stopped successfully' });
    } catch (error) {
        console.error('Error stopping charging:', error);
        res.status(500).json({ error: 'Failed to stop charging' });
    }
});

app.get('/getTimers', (req, res) => {
    const { vin } = req.query;

    if (!vin) {
        return res.status(400).json({ error: 'VIN is required to get timers' });
    }

    const timers = vinTimersMap.get(vin);
    if (!timers) {
        return res.json({ message: 'No timers are currently set for this VIN.' });
    }

    const { startTimerObj, stopTimerObj } = timers;

    const currentTime = Date.now();
    const startTimerRemaining = startTimerObj.timer ? Math.max(0, startTimerObj.delay - (currentTime - new Date().getTime())) : null;
    const stopTimerRemaining = stopTimerObj.timer ? Math.max(0, stopTimerObj.delay - (currentTime - new Date().getTime())) : null;

    res.json({
        message: `Timers are currently set for VIN: ${vin}.`,
        startTime: startTimerObj.timeSet,
        stopTime: stopTimerObj.timeSet,
        startTimerRemaining: startTimerRemaining ? `${Math.floor(startTimerRemaining / 1000)} seconds remaining` : 'N/A',
        stopTimerRemaining: stopTimerRemaining ? `${Math.floor(stopTimerRemaining / 1000)} seconds remaining` : 'N/A'
    });
});

app.get('/carStatus', async (req, res) => {
    const { vin } = req.query;

    if (!vin) {
        return res.status(400).json({ error: 'VIN is required to check car status' });
    }

    try {
        const vehicleDetails = await bmwClient.vehicleDetails(vin);

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
        console.error(`Error retrieving car status for VIN: ${vin}:`, error);
        res.status(500).json({ error: `Failed to retrieve car status for VIN: ${vin}` });
    }
});


app.listen(port, () => {
    console.log(`Timer API running on http://localhost:${port}`);
});
