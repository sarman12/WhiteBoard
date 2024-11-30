const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRoom', ({ roomID, name }) => {
    if (!rooms[roomID]) {
      rooms[roomID] = [];
    }

    const userExists = rooms[roomID].some((user) => user.name === name);

    if (!userExists) {
      rooms[roomID].push({ id: socket.id, name });
      socket.join(roomID);
      io.to(roomID).emit('updateUsers', rooms[roomID].map((user) => user.name));
    }
  });

  socket.on('drawing', ({ roomID, data }) => {
    socket.to(roomID).emit('drawing', data);
  });

  socket.on('clear', (roomID) => {
    io.to(roomID).emit('clear');
  });

  socket.on('disconnect', () => {
    for (const roomID in rooms) {
      rooms[roomID] = rooms[roomID].filter((user) => user.id !== socket.id);

      io.to(roomID).emit('updateUsers', rooms[roomID].map((user) => user.name));
    }
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
