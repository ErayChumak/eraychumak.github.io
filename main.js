const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use("/", express.static("public"));

const players = {};

class Player {
  constructor(id) {
    this.id = id;
    players[id] = this;
  }

  update({ pos, r }) {
    this.pos = pos;
    this.r = r;
  }

  leave() {
    delete players[this.id];
  }
}

io.on("connection", (socket) => {
  console.log("[ORION.IO] Player joined:", socket.id);

  const p = new Player(socket.id);

  socket.on("disconnect", () => {
    console.log("[ORION.IO] Player left:", socket.id);
    players[socket.id].leave();
  });

  socket.on("updateLocation", (newPos) => {
    p.update(newPos);
  });

  setInterval(() => {
    socket.emit("allPlayers", players);
  }, 50);
});

server.listen(3000, () => {
  console.log("Orion.io started.");
});