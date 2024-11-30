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

// Room structure
const rooms = {};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // When a user joins a room
  socket.on('joinRoom', ({ roomID, name }) => {
    if (!rooms[roomID]) {
      rooms[roomID] = { users: [], host: null };
    }

    const userExists = rooms[roomID].users.some((user) => user.name === name);

    if (!userExists) {
      rooms[roomID].users.push({ id: socket.id, name });
      if (!rooms[roomID].host) {
        rooms[roomID].host = socket.id; // First user becomes the host
      }
      socket.join(roomID);

      // Notify users about the updated room status
      io.to(roomID).emit('updateUsers', {
        users: rooms[roomID].users.map((user) => user.name),
        host: rooms[roomID].host,
      });
    }
  });

  socket.on('drawing', ({ roomID, data }) => {
    socket.to(roomID).emit('drawing', data);
  });

  socket.on('clear', (roomID) => {
    if (rooms[roomID] && rooms[roomID].host === socket.id) {
      io.to(roomID).emit('clear'); // Only the host can clear
    } else {
      socket.emit('notHost'); // Notify non-hosts that they lack permission
    }
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    for (const roomID in rooms) {
      const room = rooms[roomID];
      room.users = room.users.filter((user) => user.id !== socket.id);

      // If the host disconnects, assign a new host
      if (room.host === socket.id) {
        room.host = room.users[0]?.id || null; // Assign new host or set to null
      }

      // Notify users about the updated room status
      io.to(roomID).emit('updateUsers', {
        users: room.users.map((user) => user.name),
        host: room.host,
      });

      // Remove empty rooms
      if (room.users.length === 0) {
        delete rooms[roomID];
      }
    }
  });
});

server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
