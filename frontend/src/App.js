import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [vin, setVin] = useState('');
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [message, setMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [charging, setCharging] = useState(false);
  const [schedule, setSchedule] = useState({ startTime: '', stopTime: '' });
  const [imageSrc, setImageSrc] = useState('');

  const apiUrlBase = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const storedVin = localStorage.getItem('vin');
    if (storedVin) {
      setVin(storedVin);
    }
  }, []);

  useEffect(() => {
    if (vin) {
      setMessage('Loading...');
      localStorage.setItem('vin', vin);
      fetchCarStatus(vin);
      fetchTimers(vin);
      fetchVehicleImage(vin, 'FrontView');
    } else {
      localStorage.removeItem('vin');
      setImageSrc('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vin]);

  const fetchCarStatus = async (vin) => {
    try {
      const response = await fetch(`${apiUrlBase}/vehicleStatus?vin=${vin}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setConnected(data.status.isConnected);
        setCharging(data.status.isCharging);
        setMessage('');
        return data.status
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Unable to get car status');
    }
    return null
  };

  const fetchTimers = async (vin) => {
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
          setSchedule({ startTime: data.startTime, stopTime: data.stopTime });
        } else {
          setSchedule({ startTime: '', stopTime: '' });
        }
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Unable to get timers');
    }
  };

  const fetchVehicleImage = async (vin, view) => {
    try {
      const response = await fetch(`${apiUrlBase}/vehicleImages?vin=${vin}&view=${view}`);

      // Check if the response is OK
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } else {
        setMessage(`Error: Unable to fetch vehicle image`);
      }
    } catch (error) {
      setMessage('Error: Unable to fetch vehicle image');
    }
  };

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
        fetchTimers(vin);
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
        setSchedule({ startTime: '', stopTime: '' });
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Unable to clear timers');
    }
  };

  const pollCarStatus = async (vin, expectedChargingStatus, maxTries = 8) => {
    let tries = 0;

    while (tries < maxTries) {
      setMessage('Waiting for car status...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const status = await fetchCarStatus(vin);

      if (status && status.isCharging === expectedChargingStatus) {
        return;
      }

      tries++;
    }

    setMessage('Failed to meet expected car status');
  };

  const handleStartCharging = async () => {
    setMessage('Starting charging...');

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
        pollCarStatus(vin, true);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Unable to start charging');
    }
  };

  const handleStopCharging = async () => {
    setMessage('Stopping charging...');

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
        pollCarStatus(vin, false);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Unable to stop charging');
    }
  };

  return (
    <div className="w-full min-h-screen bg-background flex justify-center py-8">
      <div className="max-w-lg flex flex-col">
        <h1 className="text-4xl font-bold text-center pb-8">BMW Charging</h1>
        <div className="bg-card shadow-lg rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Car</h2>
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="VIN or part of the model"
            className="border border-gray-300 text-gray-600 p-2 rounded"
          />
        </div>

        {/* Display the vehicle image */}
        {imageSrc && (
          <div className="mt-8">
            <img src={imageSrc} alt="Vehicle" className="w-full" />
          </div>
        )}

        {/* Charging Status Card */}
        {vin ? (
          <div className="bg-card shadow-lg rounded-lg p-6 flex flex-row justify-between mt-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">{connected ? "Connected" : "Not connected"}</h2>
              <p className="text-lg text-gray-600">{charging ? 'Charging' : 'Not charging'}</p>
            </div>
            <div className='flex flex-col justify-end'>
              <div>
                {charging ? (
                  <button onClick={handleStopCharging} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Stop
                  </button>
                ) : (
                  <button onClick={handleStartCharging} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Start
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* Current Schedule Card */}
        {vin && schedule.startTime && schedule.stopTime ? (
          <div className="bg-card shadow-lg rounded-lg p-6 flex flex-col justify-between mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Current schedule</h2>
            <div className="flex items-center space-x-4 text-gray-600 text-lg">
              {schedule.startTime || '--:--'} <p className='text-gray-500 mx-2'>-</p> {schedule.stopTime || '--:--'}
            </div>
            <div>
              <button onClick={handleClearTimers} className="mt-8 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {/* Create Schedule Card */}
        {vin && !schedule.startTime && !schedule.stopTime ? (
          <div className="bg-card shadow-lg rounded-lg p-6 flex flex-col justify-between mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create schedule</h2>
            <div className="flex items-center space-x-4 text-gray-600">
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="(hh:mm)"
                disabled={!vin}
                className="w-24 border border-gray-300 p-2 rounded"
              />
              <p className='text-gray-400 mx-2'>-</p>
              <input
                type="text"
                value={stopTime}
                onChange={(e) => setStopTime(e.target.value)}
                placeholder="(hh:mm)"
                disabled={!vin}
                className="w-24 border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <button onClick={handleSetTimers} className="mt-8 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Set
              </button>
            </div>
          </div>
        ) : null}
        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
}

export default App;
