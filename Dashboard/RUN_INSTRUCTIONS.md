# MongoDB Dashboard - Auto Port Configuration

## 🚀 Quick Start (Automatic Port Selection)

### Option 1: One-Command Startup
```bash
cd "/Users/atharva/Integration Task/Dashboard"
./start.sh
```
This script will automatically:
- Find available ports for both backend and frontend
- Update configuration files
- Start both servers
- Display the correct URLs

### Option 2: Manual Startup

#### Step 1: Start Backend (Auto-Port)
```bash
cd "/Users/atharva/Integration Task/Dashboard/backend"
npm start
```
The backend will automatically find an available port starting from 3001:
- If 3001 is free → uses 3001
- If 3001 is busy → tries 3002, 3003, etc.

#### Step 2: Update Frontend Configuration
If the backend uses a different port, update the frontend:
```bash
cd "/Users/atharva/Integration Task/Dashboard"
echo "VITE_API_URL=http://localhost:[BACKEND_PORT]/api" > .env
```
Replace `[BACKEND_PORT]` with the actual port shown in backend startup logs.

#### Step 3: Start Frontend
```bash
cd "/Users/atharva/Integration Task/Dashboard"
npm run dev
```

## 🔧 Current Configuration

**Backend**: Auto-detects available port (currently: 30011)
**Frontend**: http://localhost:5173
**API**: http://localhost:30011/api

## 🎯 Access Points

- **Dashboard Home**: http://localhost:5173/
- **Applications (MongoDB Data)**: http://localhost:5173/applications
- **API Health Check**: http://localhost:30011/api/health
- **API Data**: http://localhost:30011/api/applications

## 📊 Features

✅ **Automatic Port Detection**: No more "port already in use" errors
✅ **MongoDB Integration**: 50 applications from your admin collection
✅ **Customer ID Display**: Shows CUS_0x17419 instead of MongoDB _id
✅ **Email Privacy**: Email addresses hidden from table view
✅ **Interactive Status Updates**: Change application statuses
✅ **Real-time Sync**: Live data from MongoDB Atlas

## 🛠️ Troubleshooting

**If backend port changes:**
The backend will automatically tell you which port it's using. Just update the frontend:
```bash
echo "VITE_API_URL=http://localhost:[NEW_PORT]/api" > .env
```

**To stop all servers:**
```bash
pkill -f "node server.js"
pkill -f "vite"
```

**To restart with clean slate:**
```bash
./start.sh
```

## ✅ Success Indicators

- Backend shows: "✅ Server successfully started on port [NUMBER]"
- Frontend shows: "VITE v7.1.4 ready"
- Browser displays applications table with Customer IDs
- MongoDB shows "Connected to MongoDB Database: test"

Your MongoDB dashboard is now running with automatic port management!
