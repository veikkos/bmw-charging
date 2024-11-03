// src/components/AppUI.js
import React from 'react';

const AppUI = ({
  vin,
  setVin,
  startTime,
  setStartTime,
  stopTime,
  setStopTime,
  message,
  connected,
  charging,
  batteryLevel,
  schedule,
  imageSrc,
  handleClearTimers,
  handleSetTimers,
  handleOptimize,
  handleStartCharging,
  handleStopCharging,
}) => (
  <div className="w-full min-h-screen bg-background flex justify-center py-8">
    <div className="max-w-lg flex flex-col">
      <h1 className="text-4xl font-bold text-center pb-8">BMW Charging</h1>
      <div className="bg-card shadow-lg rounded-lg p-6 flex flex-col">
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
        <div className={`shadow-lg rounded-lg p-6 flex flex-row justify-between mt-8 ${charging ? 'pulse bg-charging' : 'bg-card'}`}>
          <div>
            <h2 className={`text-xl font-bold ${charging ? 'text-gray-200' : 'text-gray-800'}`}>
              {connected ?
                batteryLevel ? `Connected (${batteryLevel}%)` : "Connected" :
                batteryLevel ? `Not connected (${batteryLevel}%)` : "Not connected"}
            </h2>
            {connected ? (
              <p className={`text-lg mt-4 ${charging ? 'text-gray-300' : 'text-gray-600'}`}>
                {charging ? 'Charging' : 'Not charging'}
              </p>
            ) : null}
          </div>
          {connected ? (
            <div className='flex flex-col justify-end'>
              <div>
                {charging ? (
                  <button onClick={handleStopCharging} className="bg-blue-600 text-gray-200 px-4 py-2 rounded hover:bg-blue-500">
                    Stop
                  </button>
                ) : (
                  <button onClick={handleStartCharging} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Start
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Current Schedule Card */}
      {vin && (schedule.startTime || schedule.stopTime) ? (
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
            <button onClick={handleOptimize} className="mt-8 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4">
              Optimize
            </button>
          </div>
        </div>
      ) : null}
      {message && <p className="mt-4">{message}</p>}
    </div>
  </div>
);

export default AppUI;
