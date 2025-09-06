#!/bin/bash

# Startup script for the MongoDB Dashboard project
# This script will automatically find available ports and start both backend and frontend

echo "🚀 Starting MongoDB Dashboard Project..."
echo "========================================="

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Wait a moment for processes to terminate
sleep 2

# Navigate to backend directory
cd "/Users/atharva/Integration  Task/Dashboard/backend"

echo "📡 Starting backend server..."
# Start backend in background and capture the port it uses
npm start &
BACKEND_PID=$!

# Wait for backend to start and find its port
sleep 5

# Find the actual port being used by the backend
BACKEND_PORT=$(lsof -ti :3001 2>/dev/null || lsof -ti :3002 2>/dev/null || lsof -ti :3003 2>/dev/null || echo "3001")

if [ "$BACKEND_PORT" != "3001" ]; then
    echo "📝 Backend started on port $BACKEND_PORT (3001 was in use)"
    # Update frontend environment variable
    echo "VITE_API_URL=http://localhost:$BACKEND_PORT/api" > "/Users/atharva/Integration  Task/Dashboard/.env"
else
    echo "✅ Backend started on default port 3001"
fi

# Navigate to frontend directory
cd "/Users/atharva/Integration  Task/Dashboard"

echo "🌐 Starting frontend dashboard..."
# Start frontend
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

echo ""
echo "🎉 Project Started Successfully!"
echo "================================="
echo "📡 Backend API: http://localhost:$BACKEND_PORT"
echo "🌐 Frontend: http://localhost:5173"
echo "📊 Applications: http://localhost:5173/applications"
echo ""
echo "Press Ctrl+C to stop both servers"

# Keep script running and handle Ctrl+C
trap 'echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT

# Wait for user to stop
wait
