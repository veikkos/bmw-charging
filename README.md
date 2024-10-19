# BMW Charging App

This project is a monorepo containing both the frontend and backend for controlling BMW charging. The frontend is a React app, and the backend is an Express.js server.

The app is very rudimental but allows setting explicit start and stop times for charging. This is not possible with the official BMW app, which only allows setting preferred charging times but still charges the vehicle outside of these times if otherwise unable to fulfill the set target charge level. This can lead to high electricity costs if the vehicle is charged during peak hours.

Please note that the app is not officially supported by BMW and may not work with all BMW vehicles. It was developed for my personal use and is provided as-is.

The application supports simple automated charging cost optimization using https://spot-hinta.fi/.

The app has been implemented with the help of AI.

## Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v16 or higher recommended)
- **npm** (or maybe **yarn**)

## Environment Configuration

### Frontend

The frontend uses environment variables to configure the API URL.

1. Create a `.env` file in the `frontend/` directory with the following content:

    ```
    REACT_APP_API_URL=http://localhost:3000
    ```

    - Replace `http://localhost:3000` with the URL where your backend server is running.

### Backend

The backend uses environment variables to configure CORS and other settings.

1. Create a `.env` file in the `backend/` directory with the following content:

    ```
    CORS_ORIGIN=http://localhost:8090
    ```

    - Replace `http://localhost:8090` with the URL where your frontend is running.

2. Create `~/.bmw` as explained in https://github.com/colinbendell/bmw.

## Backend Endpoints

- **`/setTimers`** (POST)
  - **Description**: Set start and stop timers for vehicle charging.
  - **Body**:
    ```json
    {
      "vin": "your-vin-number",
      "startTime": "hh:mm",
      "stopTime": "hh:mm"
    }
    ```

- **`/clearTimers`** (POST)
  - **Description**: Clears all active charging timers.
  - **Body**:
    ```json
    {
      "vin": "your-vin-number"
    }
    ```

- **`/startCharging`** (POST)
  - **Description**: Starts charging the vehicle immediately.
  - **Body**:
    ```json
    {
      "vin": "your-vin-number"
    }
    ```

- **`/stopCharging`** (POST)
  - **Description**: Stops charging the vehicle immediately.
  - **Body**:
    ```json
    {
      "vin": "your-vin-number"
    }
    ```

- **`/getTimers`** (GET)
  - **Description**: Fetches the current start and stop timers for the vehicle.
  - **Query Parameters**:
    ```json
    {
      "vin": "your-vin-number"
    }
    ```

- **`/vehicleStatus`** (GET)
  - **Description**: Fetches the current status of the vehicle (connected, charging, etc.).
  - **Query Parameters**:
    ```json
    {
      "vin": "your-vin-number"
    }
    ```

- **`/vehicleImages`** (GET)
  - **Description**: Fetches vehicle images (PNG).
  - **Query Parameters**:
    ```json
    {
      "vin": "your-vin-number",
      "view": "SideViewLeft|RearView|FrontView|SideViewRight|VehicleStatus|Dashboard"
    }
    ```

## Development Setup

### 1. Install dependencies

`npm run install:all`

### 2. Start the development setup (frontend + backend)

To run the frontend in development mode, use:

`npm start`

This will start the frontend on port `8091` and the backend on port `3000`.
