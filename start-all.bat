@echo off
setlocal
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

echo ========================================================
echo   Launching AgriFlow Agriculture Management Monorepo
echo   SIH20676 Solution
echo ========================================================

echo Checking Node.js runtime...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js was not found in PATH!
    pause
    exit /b 1
)

echo [1/3] Starting FastAPI AI Microservice on Port 8000...
start "AgriFlow - FastAPI ML Service" cmd /k "cd ml-service && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/3] Starting Node.js Express Backend on Port 5000...
start "AgriFlow - Express Backend" cmd /k "set PATH=%LOCALAPPDATA%\Programs\nodejs;%%PATH%% && cd server && npm start"

echo [3/3] Starting React Dashboard on Port 5173...
start "AgriFlow - React Client" cmd /k "set PATH=%LOCALAPPDATA%\Programs\nodejs;%%PATH%% && cd client && npm run dev"

echo.
echo ========================================================
echo   All AgriFlow services started!
echo   - Web Dashboard:  http://localhost:5173
echo   - Backend API:    http://localhost:5000/api/health
echo   - FastAPI Docs:   http://127.0.0.1:8000/docs
echo ========================================================
echo.
pause
