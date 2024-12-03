const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinRoom", ({ roomID, name }) => {
    console.log(`${name} is joining room: ${roomID}`);

    if (!rooms[roomID]) {
      rooms[roomID] = { users: [], hostName: null };
    }

    const room = rooms[roomID];
    const existingUser = room.users.find((user) => user.name === name);

    if (existingUser) {
      existingUser.id = socket.id;
    } 
    socket.join(roomID);
    console.log(`Users in room ${roomID}:`, room.users.map((u) => u.name));

    io.to(roomID).emit("updateUsers", {
      users: room.users.map((user) => user.name),
      host: room.hostName,
    });
  });

  socket.on("send_message", (messageData) => {
    console.log(`Message received from ${messageData.username} in room ${messageData.room}: ${messageData.text}`);
    io.to(messageData.room).emit("receive_message", messageData);
  });

  socket.on("typing", ({ room, username, typing }) => {
    console.log(`${username} is typing in room ${room}: ${typing}`);
    socket.to(room).emit("user_typing", { username, typing });
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    for (const roomID in rooms) {
      const room = rooms[roomID];
      const userIndex = room.users.findIndex((user) => user.id === socket.id);

      if (userIndex !== -1) {
        const userName = room.users[userIndex].name;
        console.log(`${userName} disconnected from room ${roomID}`);
        room.users.splice(userIndex, 1);

        io.to(roomID).emit("updateUsers", {
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

server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
