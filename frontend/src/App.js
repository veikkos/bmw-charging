import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [vin, setVin] = useState('');
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [message, setMessage] = useState('');

  const apiUrlBase = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const storedVin = localStorage.getItem('vin');
    if (storedVin) {
      setVin(storedVin);
    }
  }, []);

  useEffect(() => {
    if (vin) {
      localStorage.setItem('vin', vin);
    }
  }, [vin]);

  const handleSetTimers = async () => {
    try {
      const response = await fetch(`${apiUrlBase}/setTimers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: startTime,
          stopTime: stopTime,
          vin: vin,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Success: Timers set!`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Unable to set timers');
    }
  };

  const handleClearTimers = async () => {
    try {
      const response = await fetch(`${apiUrlBase}/clearTimers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vin: vin,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Success: Timers cleared!');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Unable to clear timers');
    }
  };

  const handleStartCharging = async () => {
    try {
      const response = await fetch(`${apiUrlBase}/startCharging`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vin }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Success: Charging started!');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Unable to start charging');
    }
  };

  const handleStopCharging = async () => {
    try {
      const response = await fetch(`${apiUrlBase}/stopCharging`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vin }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Success: Charging stopped!');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Unable to stop charging');
    }
  };

  const handleCheckCarStatus = async () => {
    try {
      const response = await fetch(`${apiUrlBase}/carStatus?vin=${vin}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Car Status: ${data.message}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Unable to get car status');
    }
  };

  const handleCheckTimers = async () => {
    try {
      const response = await fetch(`${apiUrlBase}/getTimers?vin=${vin}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.startTime && data.stopTime) {
          setMessage(`Timers: Start in ${data.startTime}, Stop in ${data.stopTime}`);
        } else {
          setMessage('No timers set');
        }
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Unable to get timers');
    }
  };

  return (
    <div className="App">
      <h1>BMW Charging</h1>
      <div className="form-group">
        <label>VIN:</label>
        <input
          type="text"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="Enter VIN"
        />
      </div>
      <div className="form-group">
        <label>Start Time:</label>
        <input
          type="text"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder="(hh:mm)"
          disabled={!vin}
        />
      </div>
      <div className="form-group">
        <label>Stop Time:</label>
        <input
          type="text"
          value={stopTime}
          onChange={(e) => setStopTime(e.target.value)}
          placeholder="(hh:mm)"
          disabled={!vin}
        />
      </div>
      <button onClick={handleSetTimers} disabled={!vin}>Set Timers</button>
      <button onClick={handleClearTimers} disabled={!vin}>Clear Timers</button>
      <button onClick={handleStartCharging} disabled={!vin}>Start Charging</button>
      <button onClick={handleStopCharging} disabled={!vin}>Stop Charging</button>
      <button onClick={handleCheckCarStatus} disabled={!vin}>Check Car Status</button>
      <button onClick={handleCheckTimers} disabled={!vin}>Check Current Timers</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
