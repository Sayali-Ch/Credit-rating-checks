# MongoDB Dashboard - Port 3001 Setup & Troubleshooting

## 🚀 How to Run the Project (Port 3001)

### Step 1: Start Backend
```bash
cd "/Users/atharva/Integration Task/Dashboard/backend"
npm start
```

### Step 2: Start Frontend
```bash
cd "/Users/atharva/Integration Task/Dashboard"
npm run dev
```

### Step 3: Access the Application
- **Dashboard**: http://localhost:5173/
- **Applications**: http://localhost:5173/applications
- **API**: http://localhost:3001/api/applications

## 🛠️ Port Conflict Resolution

### If You See "EADDRINUSE: address already in use :::3001"

#### Method 1: Kill Specific Port (Recommended)
```bash
# Find what's using port 3001
lsof -i :3001

# Kill the process using port 3001
lsof -ti :3001 | xargs kill -9

# Then restart your backend
cd "/Users/atharva/Integration Task/Dashboard/backend"
npm start
```

#### Method 2: Kill All Node Processes
```bash
# Kill all Node.js processes (be careful!)
pkill -f "node"

# Or kill specific server processes
pkill -f "node server.js"

# Then restart
npm start
```

#### Method 3: One-Line Solution
```bash
# Stop port 3001 and restart backend in one command
lsof -ti :3001 | xargs kill -9 && cd "/Users/atharva/Integration Task/Dashboard/backend" && npm start
```

#### Method 4: Complete Reset
```bash
# Stop everything and restart fresh
pkill -f "node server.js"
pkill -f "vite"
sleep 2

# Start backend
cd "/Users/atharva/Integration Task/Dashboard/backend"
npm start &

# Start frontend
cd "/Users/atharva/Integration Task/Dashboard"
npm run dev
```

## 🔍 Diagnostic Commands

### Check What's Running on Port 3001
```bash
lsof -i :3001
```

### Check All Node Processes
```bash
ps aux | grep node
```

### Check Frontend Port (5173)
```bash
lsof -i :5173
```

### Test API Connection
```bash
curl http://localhost:3001/api/health
```

## 📋 Quick Startup Script

Create this script for easy startup:

```bash
#!/bin/bash
echo "🚀 Starting MongoDB Dashboard..."

# Kill existing processes
echo "🧹 Cleaning up..."
lsof -ti :3001 | xargs kill -9 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2

# Start backend
echo "📡 Starting backend..."
cd "/Users/atharva/Integration Task/Dashboard/backend"
npm start &

# Wait for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend..."
cd "/Users/atharva/Integration Task/Dashboard"
npm run dev &

echo "✅ Both services started!"
echo "📊 Dashboard: http://localhost:5173/applications"
```

## ⚠️ Common Issues & Solutions

### Issue: "Cannot GET /"
**Solution**: Make sure both backend and frontend are running

### Issue: "Network Error" in browser
**Solution**: Check if backend is running on port 3001
```bash
curl http://localhost:3001/api/health
```

### Issue: Empty table in applications
**Solution**: Check MongoDB connection
```bash
curl http://localhost:3001/api/applications
```

### Issue: Frontend not loading
**Solution**: Check if port 5173 is free
```bash
lsof -i :5173
# If something is using it:
lsof -ti :5173 | xargs kill -9
```

## 🎯 Project Status Verification

### Quick Health Check
```bash
# Backend
curl http://localhost:3001/api/health

# MongoDB Data
curl http://localhost:3001/api/applications | head -20

# Frontend (in browser)
open http://localhost:5173/applications
```

### Expected Output
- **Backend**: "Dashboard Backend API is running"
- **MongoDB**: Shows 50 applications
- **Frontend**: Table with Customer IDs, names, credit scores

## 📍 Current Configuration

- **Backend Port**: 3001 (fixed)
- **Frontend Port**: 5173 (Vite default)
- **MongoDB**: Connected to your Atlas cluster
- **Database**: test → Collection: admin
- **Records**: 50 applications

## 🚨 Emergency Reset

If nothing works, use this nuclear option:
```bash
# Kill everything
sudo pkill -f node
sudo pkill -f vite

# Wait
sleep 5

# Fresh start
cd "/Users/atharva/Integration Task/Dashboard/backend"
npm start &

cd "/Users/atharva/Integration Task/Dashboard"
npm run dev
```

Your MongoDB dashboard should now be running reliably on port 3001! 🎉
