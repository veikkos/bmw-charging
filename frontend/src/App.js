import React, { useState } from 'react';
import './App.css';

function App() {
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [message, setMessage] = useState('');

  const vin = 'i4';
  const apiUrlBase = process.env.REACT_APP_API_URL;

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

  return (
    <div className="App">
      <h1>BMW Charging</h1>
      <div className="form-group">
        <label>Start Time:</label>
        <input
          type="text"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder="(hh:mm)"
        />
      </div>
      <div className="form-group">
        <label>Stop Time:</label>
        <input
          type="text"
          value={stopTime}
          onChange={(e) => setStopTime(e.target.value)}
          placeholder="(hh:mm)"
        />
      </div>
      <button onClick={handleSetTimers}>Set Timers</button>
      <button onClick={handleClearTimers}>Clear Timers</button>
      <button onClick={handleStartCharging}>Start Charging</button>
      <button onClick={handleStopCharging}>Stop Charging</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
