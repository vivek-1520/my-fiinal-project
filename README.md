# 🗡️ Clash of DSA

A **real-time competitive coding platform** built as a final year project. Challenge friends to 1v1 DSA battles, solve algorithmic problems, earn ELO rating, and climb the leaderboard.

## 🏗️ Architecture

```
Frontend (React + Vite)        Backend (Node.js + Express)
├── Problem List               ├── Problems API (tags, filters)
├── Code Editor (Monaco)       ├── Submit API (Judge0 integration)
├── Leaderboard                ├── Ranking API (ELO system)
└── Clash Room (1v1)           └── Socket.io (real-time rooms)
                                           │
                               Data Layer  │
                               ├── MongoDB (users, problems, scores)
                               ├── Judge0 API (code execution)
                               └── Room State (timers, scores)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file (already done) - update MONGO_URI if needed
npm run seed      # Seed 8 DSA problems
npm run dev       # Start on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev       # Start on http://localhost:5173
```

## ⚙️ Environment Variables

Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/clash-of-dsa
JWT_SECRET=your_secret_key
JUDGE0_API_KEY=your_rapidapi_key    # Optional - app works without it
JUDGE0_URL=https://judge0-ce.p.rapidapi.com
```

## 🎯 Features

| Feature | Details |
|---------|---------|
| 🔐 Authentication | JWT-based login/register |
| 📋 Problem List | 8 problems (Easy/Medium/Hard) with filters & search |
| ✏️ Code Editor | Monaco editor (C++, Python, JavaScript, Java) |
| ⚔️ Clash Rooms | Real-time 1v1 via Socket.io with 15-min timer |
| 🏆 Leaderboard | ELO rating system with podium visualization |
| 📊 Results | Test case breakdown, runtime, memory stats |
| 🔄 Judge0 | Code execution (falls back to simulation if no API key) |

## 🎯 Judge0 Setup (Optional)

1. Go to [RapidAPI - Judge0](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Subscribe to the free plan
3. Copy your API key to `backend/.env`

## 📦 Tech Stack

- **Frontend**: React 18, Vite, Monaco Editor, Socket.io Client, React Router
- **Backend**: Node.js, Express, Socket.io, Mongoose
- **Database**: MongoDB
- **Code Execution**: Judge0 CE API
- **Auth**: JWT + bcryptjs
