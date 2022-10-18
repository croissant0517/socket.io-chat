const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT | 3000;
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/chat.html");
});

io.use((socket, next) => {
  const room = socket.handshake.auth.room;
  socket.room = room;
  next();
});

// when client connected
io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);
  if (socket.room) {
    socket.join(socket.room);
    socket.in(socket.room).emit("receive message", `${socket.id} join Room!`);
  } else {
    socket.join("Piblic Room");
    socket.to("Piblic Room").emit("receive message", `${socket.id} join Room!`);
  }

  // when client disconnected
  socket.on("disconnect", () => {
    if (socket.room) {
      socket
        .to(socket.room)
        .emit("receive message", `${socket.id} leave chat!`);
    } else {
      socket
        .to("Piblic Room")
        .emit("receive message", `${socket.id} leave chat!`);
    }
  });

  // when client send a message
  socket.on("chat message", (msg) => {
    // log message on server
    console.log("message: " + msg);

    // send message to every client
    // io.emit("receive message", msg);
    if (socket.room) {
      socket.to(socket.room).emit("receive message", msg);
    } else {
      socket.to("Piblic Room").emit("receive message", msg);
    }

    // send message to every client except the client who sended message
    // socket.broadcast.emit("receive message", msg);
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

// instrument(io, { auth: false });
