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
  console.log('Client connected:', socket.id);

  // Handle user joining a room
  socket.on('joinRoom', ({ roomID, name }) => {
  if (!rooms[roomID]) {
    rooms[roomID] = { users: [], hostName: null }; // Track host by name
  }

  const room = rooms[roomID];
  const existingUser = room.users.find((user) => user.name === name);

  if (existingUser) {
    // Reconnect and update socket ID
    existingUser.id = socket.id;
  } else {
    // Add new user
    room.users.push({ id: socket.id, name });

    if (!room.hostName) {
      room.hostName = name; // Assign the first user as host
    }
  }

  socket.join(roomID);

  io.to(roomID).emit('updateUsers', {
    users: room.users.map((user) => user.name),
    host: room.hostName,
  });
});


  // Handle drawing events (only host can emit drawing events)
  socket.on('drawing', ({ roomID, data }) => {
    const room = rooms[roomID];
    if (room && room.hostName && room.users.find((user) => user.id === socket.id)?.name === room.hostName) {
      socket.to(roomID).emit('drawing', data);
    } else {
      socket.emit('notAuthorized', { message: 'Only the host can draw.' });
    }
  });

  // Handle clear events (only host can emit clear events)
  socket.on('clear', (roomID) => {
    const room = rooms[roomID];
    if (room && room.hostName && room.users.find((user) => user.id === socket.id)?.name === room.hostName) {
      io.to(roomID).emit('clear');
    } else {
      socket.emit('notAuthorized', { message: 'Only the host can clear the board.' });
    }
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    for (const roomID in rooms) {
      const room = rooms[roomID];
      const userIndex = room.users.findIndex((user) => user.id === socket.id);

      if (userIndex !== -1) {
        const user = room.users[userIndex];

        // Remove user from the room
        room.users.splice(userIndex, 1);

        // Only reassign host if the actual host leaves permanently
        if (room.hostName === user.name) {
          if (room.users.length > 0) {
            room.hostName = room.users[0].name; // Reassign to the next user
          } else {
            room.hostName = null;
          }
        }

        io.to(roomID).emit('updateUsers', {
          users: room.users.map((user) => user.name),
          host: room.hostName,
        });

        // Clean up empty rooms
        if (room.users.length === 0) {
          delete rooms[roomID];
        }
      }
    }
  });
});

server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
