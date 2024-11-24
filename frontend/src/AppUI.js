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
  loggedIn,
  hcaptchaToken,
  setHcaptchaToken,
  handleSetHcaptchaToken,
  handleClearTimers,
  handleSetTimers,
  handleOptimize,
  handleStartCharging,
  handleStopCharging,
}) => {
  const cardClasses = "bg-card shadow-lg rounded-lg p-6";
  const buttonClasses = "px-4 py-2 rounded hover:bg-blue-600";
  const chargingButtonClasses = charging ? "bg-blue-600 text-gray-200" : "bg-blue-500 text-white";
  const textClasses = charging ? 'text-gray-200' : 'text-gray-800';
  const titleClasses = "text-xl font-bold mb-4 text-gray-800";
  const smallTextClasses = charging ? 'text-gray-300' : 'text-gray-600';

  const renderConnectionStatus = () => (
    <h2 className={`text-xl font-bold ${textClasses}`}>
      {connected
        ? batteryLevel ? `Connected (${batteryLevel}%)` : 'Connected'
        : batteryLevel ? `Not connected (${batteryLevel}%)` : 'Not connected'}
    </h2>
  );

  const renderChargingStatus = () => (
    loggedIn && connected && (
      <p className={`text-lg mt-4 ${smallTextClasses}`}>
        {charging ? 'Charging' : 'Not charging'}
      </p>
    )
  );

  const renderScheduleCard = () => (
    loggedIn && vin && (schedule.startTime || schedule.stopTime) && (
      <div className={`${cardClasses} flex flex-col justify-between mt-8`}>
        <h2 className={titleClasses}>Current schedule</h2>
        <div className="flex items-center space-x-4 text-gray-600 text-lg">
          {schedule.startTime || '--:--'} <p className='text-gray-500 mx-2'>-</p> {schedule.stopTime || '--:--'}
        </div>
        <div>
          <button onClick={handleClearTimers} className={`${buttonClasses} mt-8 bg-blue-500 text-white`}>
            Cancel
          </button>
        </div>
      </div>
    )
  );

  const renderCreateScheduleCard = () => (
    loggedIn && vin && !schedule.startTime && !schedule.stopTime && (
      <div className={`${cardClasses} flex flex-col justify-between mt-8`}>
        <h2 className={titleClasses}>Create schedule</h2>
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
          <button onClick={handleSetTimers} className={`${buttonClasses} mt-8 bg-blue-500 text-white`}>
            Set
          </button>
          <button onClick={handleOptimize} className={`${buttonClasses} mt-8 bg-blue-500 text-white ml-4`}>
            Optimize
          </button>
        </div>
      </div>
    )
  );

  const renderLoginCard = () => (
    !loggedIn && (
      <div className={`${cardClasses} bg-warning flex flex-col justify-between mb-8`}>
        <h2 className={titleClasses}>Login</h2>
        <div className={'flex flex-row justify-between'}>
          <input
            type="text"
            placeholder="hCaptcha token"
            value={hcaptchaToken}
            onChange={(e) => setHcaptchaToken(e.target.value)}
            className="border border-gray-300 text-gray-600 p-2 rounded flex-grow mr-4"
          />
          <button
            onClick={() => handleSetHcaptchaToken(hcaptchaToken)}
            className={`${buttonClasses} bg-blue-500 text-white`}
          >
            Login
          </button>
        </div>
      </div>
    )
  );

  return (
    <div className="w-full min-h-screen bg-background flex justify-center py-8">
      <div className="max-w-lg flex flex-col">
        <h1 className="text-4xl font-bold text-center pb-8">BMW Charging</h1>
        {renderLoginCard()}
        {loggedIn && (
          <div className={`${cardClasses} flex flex-col`}>
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              placeholder="VIN or part of the model"
              className="border border-gray-300 text-gray-600 p-2 rounded"
            />
          </div>
        )}

        {loggedIn && imageSrc && (
          <div className="mt-8">
            <img src={imageSrc} alt="Vehicle" className="w-full" />
          </div>
        )}

        {loggedIn && vin && (
          <div className={`${cardClasses} flex flex-row justify-between mt-8 ${charging ? 'pulse bg-charging' : ''}`}>
            <div>
              {renderConnectionStatus()}
              {renderChargingStatus()}
            </div>
            {connected && (
              <div className="flex flex-col justify-end">
                <button
                  onClick={charging ? handleStopCharging : handleStartCharging}
                  className={`${buttonClasses} ${chargingButtonClasses}`}
                >
                  {charging ? 'Stop' : 'Start'}
                </button>
              </div>
            )}
          </div>
        )}

        {renderScheduleCard()}
        {renderCreateScheduleCard()}

        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default AppUI;
