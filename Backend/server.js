const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

let sessions = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on("joinSession", ({ sessionCode, user }) => {
    console.log(`${user.name} joined session: ${sessionCode}`);
    
    if (!sessions[sessionCode]) {
      sessions[sessionCode] = { users: [] };
    }
    sessions[sessionCode].users.push({ id: socket.id, name: user.name });
    io.to(sessionCode).emit("userJoined", { id: socket.id, name: user.name });
    
    socket.join(sessionCode);
  });

  socket.on("whiteboard-update", ({ sessionCode, data }) => {
    socket.to(sessionCode).emit("whiteboard-update", data);
  });

  socket.on("clear-whiteboard", ({ sessionCode }) => {
    io.to(sessionCode).emit("whiteboard-update", { clear: true });
  });

  socket.on('disconnect', () => {
    for (const sessionCode in sessions) {
      const userIndex = sessions[sessionCode].users.findIndex(user => user.id === socket.id);
      if (userIndex !== -1) {
        sessions[sessionCode].users.splice(userIndex, 1);
        io.to(sessionCode).emit("userLeft", socket.id);
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
