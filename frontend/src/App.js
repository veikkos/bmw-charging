import React, { useState, useEffect } from 'react';
import './App.css';
import AppUI from './AppUI';
import { fetchSpotPrices } from './Spot';
import { findBestChargingSlot, calculateAverageChargingPrice } from './Optimize';

function App() {
  const [vin, setVin] = useState('');
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [message, setMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [charging, setCharging] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [schedule, setSchedule] = useState({ startTime: '', stopTime: '' });
  const [imageSrc, setImageSrc] = useState('');
  const [prices, setPrices] = useState(null);
  const [hcaptchaToken, setHcaptchaToken] = useState('');
  const [loggedIn, setLoggedIn] = useState(true);

  const apiUrlBase = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const storedVin = localStorage.getItem('vin');
    if (storedVin) {
      setVin(storedVin);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vin]);

  const fetchData = async () => {
    if (vin) {
      setMessage('Loading...');
      localStorage.setItem('vin', vin);
      // Fetch car status first before starting other parallel requests
      // to allow backend to login first if necessary
      if (await fetchCarStatus(vin)) {
        fetchTimers(vin);
        fetchVehicleImage(vin, 'FrontView');
      }
    } else {
      localStorage.removeItem('vin');
      setImageSrc('');
    }
  };

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
        setLoggedIn(true);
        setConnected(data.status.isConnected);
        setCharging(data.status.isCharging);
        setBatteryLevel(data.status.chargingLevelPercent);
        setMessage('');
        return data.status;
      } else if (response.status === 401) {
        setLoggedIn(false);
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
        setSchedule({ startTime: data.startTime ? data.startTime : '', stopTime: data.stopTime ? data.stopTime : '' });
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

  const getSpotPrices = async () => {
    let currentPrices = prices;

    if (!currentPrices) {
      const spot = await fetchSpotPrices();
      if (spot) {
        setPrices(spot);
        currentPrices = spot;
      } else {
        setMessage('Error fetching spot prices');
      }
    }

    return currentPrices;
  };

  const handleOptimize = async () => {
    setMessage('Optimizing charging schedule...');

    let currentPrices = await getSpotPrices();

    if (currentPrices) {
      const result = findBestChargingSlot(currentPrices, 8);
      if (result) {
        setStartTime(result.startTime);
        setStopTime(result.endTime);
        setMessage(`Optimized average price: ${(result.averagePrice * 100).toFixed(2)} c/kWh`);
      } else {
        setMessage('Error optimizing charging schedule');
      }
    }
  };

  const handleSetHcaptchaToken = async (hcaptchatoken) => {
    try {
      const response = await fetch(`${apiUrlBase}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hcaptchatoken: hcaptchatoken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchData();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Unable to login');
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

        if (data.startTimeDateString && data.stopTimeDateString) {
          let currentPrices = await getSpotPrices();

          if (currentPrices) {
            const { averagePrice } = calculateAverageChargingPrice(currentPrices,
              data.startTimeDateString,
              data.stopTimeDateString
            );

            if (averagePrice) {
              return setMessage(`Timers set with average price: ${(averagePrice * 100).toFixed(2)} c/kWh`);
            }
          }
        }
        setMessage('');
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
        setMessage('');
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
        setMessage('');
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
        setMessage('');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Unable to stop charging');
    }
  };

  return (
    <AppUI
      vin={vin}
      setVin={setVin}
      startTime={startTime}
      setStartTime={setStartTime}
      stopTime={stopTime}
      setStopTime={setStopTime}
      message={message}
      connected={connected}
      charging={charging}
      batteryLevel={batteryLevel}
      schedule={schedule}
      imageSrc={imageSrc}
      loggedIn={loggedIn}
      hcaptchaToken={hcaptchaToken}
      setHcaptchaToken={setHcaptchaToken}
      handleSetHcaptchaToken={handleSetHcaptchaToken}
      handleClearTimers={handleClearTimers}
      handleSetTimers={handleSetTimers}
      handleOptimize={handleOptimize}
      handleStartCharging={handleStartCharging}
      handleStopCharging={handleStopCharging}
    />
  );
}

export default App;
