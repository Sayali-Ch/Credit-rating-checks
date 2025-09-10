# Credit Rating Application Startup Script
Write-Host "🚀 Starting Credit Rating Application..." -ForegroundColor Green
Write-Host ""

# Start backend in new window
Write-Host "[1/2] Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# Wait for backend to initialize
Start-Sleep -Seconds 3

# Start frontend in new window  
Write-Host "[2/2] Starting Frontend Development Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Frontend; npm run dev"

Write-Host ""
Write-Host "✅ Both servers are starting..." -ForegroundColor Green
Write-Host "🌐 Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🌐 Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
