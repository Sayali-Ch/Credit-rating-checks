@echo off
echo Starting Credit Rating Application...
echo.

REM Start backend
echo [1/2] Starting Backend Server...
start "Backend" cmd /k "cd backend && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend  
echo [2/2] Starting Frontend Development Server...
start "Frontend" cmd /k "cd Frontend && npm run dev"

echo.
echo ✅ Both servers are starting...
echo 🌐 Backend will be available at: http://localhost:5000
echo 🌐 Frontend will be available at: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul
