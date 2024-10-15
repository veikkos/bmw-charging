import React, { useState } from 'react';
import './App.css';

function App() {
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSetTimers = async () => {
    const vin = 'i4'; // Replace with actual VIN
    const apiUrl = 'http://localhost:3000/setTimers';

    try {
      const response = await fetch(apiUrl, {
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
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
