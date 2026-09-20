# AgriFlow - AI Agriculture Management Application (SIH20676)

AgriFlow is a production-grade agriculture intelligence and disease detection platform built for the **Smart India Hackathon (SIH20676)**.

## System Architecture

The application is structured as a three-tier monorepo:

```
agriflow/
├── client/          # Frontend: React, Tailwind CSS, Framer Motion (Vite)
├── server/          # Backend: Node.js, Express.js, MongoDB (Mongoose), node-cron, Multer
└── ml-service/      # AI Microservice: Python, FastAPI, Pydantic, Uvicorn
```

---

## Key Features

1. **Authentication & Farmer Profiles**:
   - JWT-based authentication.
   - Mongoose `User` schema storing name, email, password (bcrypt hashed), and farm GPS coordinates (`latitude`, `longitude`).

2. **Weather & Automated 6:00 AM Cron Alerting**:
   - 5-day weather forecast route querying OpenWeatherMap API with fallback mock simulator.
   - `node-cron` configured to run daily at 6:00 AM (`0 6 * * *`), scanning user farm coordinates for high humidity (>80%) and recording alerts in the `Notification` schema.

3. **Crop Disease Detection Pipeline**:
   - `CropLog` schema recording image URL, disease name, treatment plan, confidence, and timestamp.
   - FastAPI microservice accepting multipart image uploads (`POST /predict`), returning pathology diagnosis (`Leaf Rust`) and agronomic treatment protocols.
   - Express `/api/disease/scan` route using Multer to receive frontend uploads, proxying them to FastAPI, persisting to MongoDB `CropLog`, and returning response to the UI.

4. **Interactive Farmer Dashboard**:
   - Real-time weather cards & humidity meter.
   - Drag-and-drop crop leaf photo uploader with laser scanning animation.
   - Live historical feed of past `CropLog` diagnoses with expandable treatment guides.

---

## Quick Start Guide

### Step 1: Install Dependencies

#### 1. Backend (`/server`)
```bash
cd server
npm install
```

#### 2. ML Microservice (`/ml-service`)
```bash
cd ml-service
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

#### 3. Frontend (`/client`)
```bash
cd client
npm install
```

---

### Step 2: Environment Variables

- In `server/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/agriflow
JWT_SECRET=agriflow_secret_key_sih20676
FASTAPI_URL=http://127.0.0.1:8000/predict
OPENWEATHER_API_KEY=your_openweathermap_api_key_optional
```

---

### Step 3: Run the Services

Open three separate terminals or run `start-all.bat`:

- **Terminal 1: FastAPI Microservice (Port 8000)**
  ```bash
  cd ml-service
  uvicorn main:app --host 127.0.0.1 --port 8000 --reload
  ```
  *(Swagger UI available at `http://127.0.0.1:8000/docs`)*

- **Terminal 2: Express Backend (Port 5000)**
  ```bash
  cd server
  npm start
  ```

- **Terminal 3: React Frontend (Port 5173)**
  ```bash
  cd client
  npm run dev
  ```
