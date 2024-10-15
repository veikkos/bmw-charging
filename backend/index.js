const express = require('express');
const app = express();
const port = 3000;

const BMWClient = require('bmw/src/bmw');
const bmwClient = new BMWClient();

app.use(express.json());

let startTimer = null;
let stopTimer = null;

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

// API to set the start and stop timers for charging
app.post('/setTimers', (req, res) => {
    const { startTime, stopTime, vin } = req.body;

    if (!startTime || !stopTime || !vin) {
        return res.status(400).json({ error: 'Start time, stop time, and VIN are required' });
    }

    const startDelay = calculateDelay(startTime);
    const stopDelay = calculateDelay(stopTime);

    if (stopDelay <= startDelay) {
        return res.status(400).json({ error: 'Start time must be before stop time' });
    }

    if (startTimer) {
        clearTimeout(startTimer);
    }
    if (stopTimer) {
        clearTimeout(stopTimer);
    }

    startTimer = setTimeout(async () => {
        console.log('Start timer triggered: Starting charging...');
        try {
            await bmwClient.stopCharging(vin);
            await bmwClient.startCharging(vin);
            console.log(`Charging started for vehicle with VIN: ${vin}`);
        } catch (error) {
            console.error('Error starting charging:', error);
        }

        clearTimeout(startTimer);
    }, startDelay);

    stopTimer = setTimeout(async () => {
        console.log('Stop timer triggered: Stopping charging...');
        try {
            await bmwClient.stopCharging(vin);
            console.log(`Charging stopped for vehicle with VIN: ${vin}`);
        } catch (error) {
            console.error('Error stopping charging:', error);
        }

        clearTimeout(stopTimer);
    }, stopDelay);

    console.log(`Timers set: Start in ${startDelay / 1000} s, Stop in ${stopDelay / 1000} s`);

    res.json({ message: 'Timers set successfully', startDelay, stopDelay });
});

app.listen(port, () => {
    console.log(`Timer API running on http://localhost:${port}`);
});
