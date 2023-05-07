function connectToServer() {
  console.log("[ORION.IO] init sockets.");

  setInterval(() => {
    const start = Date.now();

    socket.emit("ping", () => {
      const duration = Date.now() - start;
      latency = duration;
    });
  }, 1000);

  socket.on("grow", (r) => {
    console.log("[ORION.IO] client grow by:", r);
    player.grow(r);
  });

  socket.on("blobRespawn", (data) => {
    console.log(`[ORION.IO] blob ${data.blobID} spawned at new position.`);
    const knownBlob = knownBlobs[data.blobID];
    knownBlob.respawn(data.newPos);
  });

  socket.on("blobHide", (blobID) => {
    console.log(`[ORION.IO] blob ${blobID} eaten.`);
    const knownBlob = knownBlobs[blobID];
    knownBlob.hide();
  });

  socket.on("allBlobs", (serverBlobs) => {
    console.log("[ORION.IO] All food blobs loaded.");

    for (const serverBlobID in serverBlobs) {
      const serverBlob = serverBlobs[serverBlobID];
      knownBlobs[serverBlobID] = new FoodBlob(serverBlobID, serverBlob.r, serverBlob.color, serverBlob.pos);
    }
  });

  socket.on("eaten", () => {
    console.log("[ORION.IO] client eaten.");
    window.alert("You have been eaten! Continuing will re-spawn you.");
    location.reload();
  });

  socket.on("allPlayers", (serverPlayers) => {
    // get rid of disconnected players locally
    for (const knownPlayerID in knownPlayers) {
      if (knownPlayerID in serverPlayers) {
        continue;
      }

      const i = allPlayersArrangement.indexOf(knownPlayers[knownPlayerID]);
      allPlayersArrangement.splice(i, 1);

      delete knownPlayers[knownPlayerID];
    }

    // create new players and sync data with existing ones
    for (const serverPlayerID in serverPlayers) {
      const serverPlayer = serverPlayers[serverPlayerID];

      // you, the client
      if (serverPlayerID === socket.id) {
        if (!player) {
          console.log("[ORION.IO] init client");
          player = new Player(getItem("username") || "Unnamed Blob", serverPlayer.pos);
        }

        continue;
      }

      if (!serverPlayer.pos) continue;

      if (serverPlayerID in knownPlayers) {
        const knownPlayer = knownPlayers[serverPlayerID];
        knownPlayer.syncNewUpdates(serverPlayer);
      } else {
        const knownPlayer = new OtherPlayer(serverPlayer);
        knownPlayers[serverPlayerID] = knownPlayer;
      }
    }
  });
}