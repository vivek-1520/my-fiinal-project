const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/problems', require('./routes/problems'));
app.use('/api/submit', require('./routes/submit'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/clash', require('./routes/clash'));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Socket.io - Clash Rooms
const clashRooms = {};

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Create or join a clash room
  socket.on('join_room', ({ roomId, username }) => {
    socket.join(roomId);

    if (!clashRooms[roomId]) {
      clashRooms[roomId] = {
        players: [],
        started: false,
        scores: {},
        startTime: null,
        duration: 15 * 60 * 1000, // 15 minutes
      };
    }

    const room = clashRooms[roomId];

    // Avoid duplicate
    if (!room.players.find((p) => p.username === username)) {
      room.players.push({ username, socketId: socket.id, solved: false });
      room.scores[username] = 0;
    }

    io.to(roomId).emit('room_update', {
      players: room.players,
      started: room.started,
    });

    console.log(`👥 ${username} joined room ${roomId}`);
  });

  // Start clash
  socket.on('start_clash', ({ roomId, problemId }) => {
    const room = clashRooms[roomId];
    if (!room) return;

    room.started = true;
    room.startTime = Date.now();
    room.problemId = problemId;

    io.to(roomId).emit('clash_started', {
      problemId,
      startTime: room.startTime,
      duration: room.duration,
    });

    // Auto end after duration
    setTimeout(() => {
      if (clashRooms[roomId] && clashRooms[roomId].started) {
        const finalScores = clashRooms[roomId].scores;
        io.to(roomId).emit('clash_ended', { scores: finalScores, reason: 'timeout' });
        clashRooms[roomId].started = false;
      }
    }, room.duration);
  });

  // Player solved the problem
  socket.on('player_solved', ({ roomId, username, timeTaken, score }) => {
    const room = clashRooms[roomId];
    if (!room) return;

    const player = room.players.find((p) => p.username === username);
    if (player) player.solved = true;
    room.scores[username] = score;

    io.to(roomId).emit('player_update', {
      username,
      solved: true,
      timeTaken,
      score,
      scores: room.scores,
    });

    // Check if all solved
    const allSolved = room.players.every((p) => p.solved);
    if (allSolved) {
      io.to(roomId).emit('clash_ended', {
        scores: room.scores,
        reason: 'all_solved',
      });
      room.started = false;
    }
  });

  // Live code sharing (optional)
  socket.on('code_update', ({ roomId, username, code }) => {
    socket.to(roomId).emit('opponent_code', { username, code });
  });

  socket.on('disconnect', () => {
    // Remove from rooms
    Object.keys(clashRooms).forEach((roomId) => {
      const room = clashRooms[roomId];
      room.players = room.players.filter((p) => p.socketId !== socket.id);
      if (room.players.length === 0) {
        delete clashRooms[roomId];
      } else {
        io.to(roomId).emit('room_update', {
          players: room.players,
          started: room.started,
        });
      }
    });
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
