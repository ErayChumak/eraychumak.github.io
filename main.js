const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const { ServerPlayer } = require("./classes/ServerPlayer");
const { ServerBlob } = require("./classes/ServerBlob");

app.use("/", express.static("public"));

const players = {};
const blobs = {};

for (let x = 0; x < 10000 / 5; x++) {
  const b = new ServerBlob(x);
  blobs[x] = b;
}

console.log(`[ORION.io] Created ${5000 / 5} food items.`);

io.on("connection", (socket) => {
  console.log("[ORION.IO] Player joined:", socket.id);

  socket.on("ping", (callback) => {
    callback();
  });

  const player = new ServerPlayer(socket.id);
  players[socket.id] = player;

  socket.emit("allBlobs", blobs);

  socket.on("disconnect", () => {
    console.log("[ORION.IO] Player left:", socket.id);
    delete players[socket.id];
  });

  // TODO: fix collision detection
  socket.on("updatePlayer", (updatedPlayer) => {
    player.update(updatedPlayer);

    for (const otherPlayerID in players) {
      if (otherPlayerID === socket.id) continue;

      const otherPlayer = players[otherPlayerID];

      if (player.r + (player.r / 4) >= otherPlayer.r) return false;
      const d = Math.sqrt((player.pos.x * player.pos.y) + (otherPlayer.pos.x * otherPlayer.pos.y));

      if (d < otherPlayer.r) {
        socket.emit("grow", otherPlayer.r);
      }
    }
  });

  socket.on("blobEaten", (blobID) => {
    const eatenBlob = blobs[blobID];

    io.emit("blobHide", blobID);
    socket.emit("grow", eatenBlob.r);

    setTimeout(() => {
      const newPos = eatenBlob.randomisePos();

      io.emit("blobRespawn", {
        blobID,
        newPos
      });
    }, 2000);
  });

  socket.on("eat", (playerID) => {
    console.log(socket.id, "ate", playerID)
    socket.broadcast.to(playerID).emit("eaten");
    socket.broadcast.to(playerID).disconnectSockets(true);
  });

  setInterval(() => {
    socket.emit("allPlayers", players);
  }, 50);
});

server.listen(3000, () => {
  console.log("Orion.io started.");
});