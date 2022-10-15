const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT | 3000;
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

// when client connected
io.on("connection", (socket) => {
  console.log(socket.id);
  console.log("a user connected");
  socket.broadcast.emit("receive message", `${socket.id} join chat!`);
  io.emit("receive message", "Hi");

  // when client disconnected
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // when client send a message
  socket.on("chat message", (msg) => {
    // log message on server
    console.log("message: " + msg);

    // send message to every client
    io.emit("receive message", msg);

    // send message to every client except the client who sended message
    // socket.broadcast.emit("receive message", msg);
  });
});

// io.on("connection", (socket) => {
//   socket.broadcast.emit("hi");
// });

// io.on("connection", (socket) => {
//   socket.on("chat message", (msg) => {
//     io.emit("receive message", msg);
//   });
// });

server.listen(port, () => {
  console.log(`listening on ${port}`);
});

instrument(io, { auth: false });
