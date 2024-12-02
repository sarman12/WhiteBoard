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

  socket.on('joinRoom', ({ roomID, name }) => {
    if (!rooms[roomID]) {
      rooms[roomID] = { users: [], hostName: null };
    }

    const room = rooms[roomID];
    const existingUser = room.users.find((user) => user.name === name);

    if (existingUser) {
      existingUser.id = socket.id;
    } else {
      room.users.push({ id: socket.id, name });

      if (!room.hostName) {
        room.hostName = name;
      }
    }

    socket.join(roomID);

    io.to(roomID).emit('updateUsers', {
      users: room.users.map((user) => user.name),
      host: room.hostName,
    });
  });

  socket.on('importImage', ({ roomID, imageData }) => {
    socket.to(roomID).emit('importImage', { imageData });
  });


  socket.on('startDrawing', ({ roomID, data }) => {
    const room = rooms[roomID];
    if (room && room.users.find((user) => user.id === socket.id)?.name === room.hostName) {
      socket.to(roomID).emit('startDrawing', data);
    }
  });

  socket.on('drawing', ({ roomID, data }) => {
    const room = rooms[roomID];
    if (room && room.users.find((user) => user.id === socket.id)?.name === room.hostName) {
      socket.to(roomID).emit('drawing', data);
    }
  });

  socket.on('stopDrawing', (roomID) => {
    const room = rooms[roomID];
    if (room && room.users.find((user) => user.id === socket.id)?.name === room.hostName) {
      socket.to(roomID).emit('stopDrawing');
    }
  });

  socket.on('clear', (roomID) => {
    const room = rooms[roomID];
    if (room && room.users.find((user) => user.id === socket.id)?.name === room.hostName) {
      io.to(roomID).emit('clear');
    } else {
      socket.emit('notAuthorized', { message: 'Only the host can clear the board.' });
    }
  });

  socket.on('disconnect', () => {
    for (const roomID in rooms) {
      const room = rooms[roomID];
      const userIndex = room.users.findIndex((user) => user.id === socket.id);

      if (userIndex !== -1) {
        room.users.splice(userIndex, 1);

        io.to(roomID).emit('updateUsers', {
          users: room.users.map((user) => user.name),
          host: room.hostName,
        });

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
