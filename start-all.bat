@echo off
echo ========================================================
echo   Launching AgriFlow Agriculture Management Monorepo
echo   SIH20676 Solution
echo ========================================================

echo Starting FastAPI AI Microservice on Port 8000...
start "AgriFlow - FastAPI ML Service" cmd /k "cd ml-service && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Node.js Express Backend on Port 5000...
start "AgriFlow - Express Backend" cmd /k "cd server && npm start"

echo Starting React Dashboard on Port 5173...
start "AgriFlow - React Client" cmd /k "cd client && npm run dev"

echo All services initiated!
echo Client: http://localhost:5173
echo Backend API: http://localhost:5000/api/health
echo FastAPI Docs: http://127.0.0.1:8000/docs
pause
