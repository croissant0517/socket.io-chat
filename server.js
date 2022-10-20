const express = require("express");
const app = express();
// const http = require("http");
// const server = http.createServer(app);
const PORT = process.env.PORT | 9000;
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

app.get("/", (req, res) => {
  res.send("It is working!");
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
