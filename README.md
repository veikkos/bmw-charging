# BMW Charging App

This project is a monorepo containing both the frontend and backend for controlling BMW charging. The frontend is a React app, and the backend is an Express.js server.

The app is very rudimental but allows setting explicit start and stop times for charging. This is not possible with the official BMW app, which only allows setting preferred charging times but still charges the vehicle outside of these times if otherwise unable to fulfill the set target charge level. This can lead to high electricity costs if the vehicle is charged during peak hours.

Please note that the app is not officially supported by BMW and may not work with all BMW vehicles. It was developed for my personal use and is provided as-is.

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
    REACT_APP_VIN=ABCDE
    ```

    - Replace `http://localhost:3000` with the URL where your backend server is running.
    - Replace `ABCDE` with the vehicle's VIN or part of its model name like 'i4'.

### Backend

The backend uses environment variables to configure CORS and other settings.

1. Create a `.env` file in the `backend/` directory with the following content:

    ```
    CORS_ORIGIN=http://localhost:8090
    ```

    - Replace `http://localhost:8090` with the URL where your frontend is running.

2. Create `~/.bmw` as explained in https://github.com/colinbendell/bmw.

---

## Backend Setup and Run

### 1. Install dependencies

Navigate to the `backend/` directory and run the following command to install dependencies:

`cd backend/ && npm install`

### 2. Start the backend server

To start the backend server, run:

`npm start`

The backend will now be running on port `3000` by default.

### 3. Endpoints

- `/setTimers` - Set start and stop timers for charging
- `/clearTimers` - Clear all active timers
- `/startCharging` - Start charging the vehicle immediately
- `/stopCharging` - Stop charging the vehicle immediately

---

## Frontend Setup and Run

### 1. Install dependencies

Navigate to the `frontend/` directory and run the following command to install dependencies:

`cd frontend/ && npm install`

### 2. Start the frontend (development)

To run the frontend in development mode, use:

`npm start`

This will start the frontend on port `8091` by default.

### 3. Build the frontend (production)

To create a production build of the frontend, run:

`npm run build`

This will output a production build in the `frontend/build/` directory.

### 4. Serve the frontend (production)

`npm run serve`
