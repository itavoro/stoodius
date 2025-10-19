import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import sessionRoutes from './routes/sessions.js';
import db from './database/db.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production_12345';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/sessions', sessionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const onlineUsers = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Authentication required'));
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Invalid token'));
    }
    socket.user = decoded;
    next();
  });
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user?.email}`);

  socket.on('join-room', ({ roomId, userName }) => {
    if (!roomId) return;
    
    socket.join(`room_${roomId}`);
    onlineUsers.set(socket.id, { roomId, userId: socket.user?.id, userName });
    
    const roomUsers = Array.from(onlineUsers.values())
      .filter(u => u.roomId === roomId);
    
    io.to(`room_${roomId}`).emit('user-joined', {
      userId: socket.user?.id,
      userName,
      onlineCount: roomUsers.length
    });

    io.to(`room_${roomId}`).emit('online-users', roomUsers);
  });

  socket.on('leave-room', ({ roomId }) => {
    if (!roomId) return;
    
    const userData = onlineUsers.get(socket.id);
    socket.leave(`room_${roomId}`);
    onlineUsers.delete(socket.id);
    
    const roomUsers = Array.from(onlineUsers.values())
      .filter(u => u.roomId === roomId);
    
    io.to(`room_${roomId}`).emit('user-left', {
      userId: socket.user?.id,
      userName: userData?.userName,
      onlineCount: roomUsers.length
    });

    io.to(`room_${roomId}`).emit('online-users', roomUsers);
  });

  socket.on('send-message', ({ roomId, content, userName }) => {
    if (!roomId || !content || !userName) return;
    
    const userId = socket.user?.id;
    
    db.run(
      'INSERT INTO messages (room_id, user_id, user_name, content) VALUES (?, ?, ?, ?)',
      [roomId, userId, userName, content],
      function(err) {
        if (err) {
          console.error('Error saving message:', err);
          return;
        }

        const message = {
          id: this.lastID,
          room_id: roomId,
          user_id: userId,
          user_name: userName,
          content,
          created_at: new Date().toISOString()
        };

        io.to(`room_${roomId}`).emit('new-message', message);
      }
    );
  });

  socket.on('typing', ({ roomId, userName, isTyping }) => {
    socket.to(`room_${roomId}`).emit('user-typing', { userName, isTyping });
  });

  socket.on('timer-started', ({ roomId, userId, userName }) => {
    io.to(`room_${roomId}`).emit('user-timer-update', {
      userId,
      userName,
      isStudying: true
    });
  });

  socket.on('timer-stopped', ({ roomId, userId, userName, durationSeconds }) => {
    io.to(`room_${roomId}`).emit('user-timer-update', {
      userId,
      userName,
      isStudying: false,
      durationSeconds
    });
  });

  socket.on('disconnect', () => {
    const userData = onlineUsers.get(socket.id);
    if (userData) {
      const { roomId, userName } = userData;
      onlineUsers.delete(socket.id);
      
      const roomUsers = Array.from(onlineUsers.values())
        .filter(u => u.roomId === roomId);
      
      io.to(`room_${roomId}`).emit('user-left', {
        userId: socket.user?.id,
        userName,
        onlineCount: roomUsers.length
      });

      io.to(`room_${roomId}`).emit('online-users', roomUsers);
    }
    console.log(`User disconnected: ${socket.user?.email}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
