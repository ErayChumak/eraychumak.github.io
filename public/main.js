const socket = io();

let otherPlayers = {};

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.style("display", "block");

  MAP.radius = windowWidth / 100;

  player = new Player("Eray");

  for (let x = 0; x < 1_000; x++) {
    new Blob();
  }

  socket.on("allPlayers", (newOtherPlayers) => {
    for (const localOtherPlayer in otherPlayers) {
      if (localOtherPlayer in newOtherPlayers) {
        continue;
      }

      delete otherPlayers[localOtherPlayer];
    }

    for (const newOtherPlayerID in newOtherPlayers) {
      if (newOtherPlayerID === socket.id) continue;

      const localOtherPlayer = otherPlayers[newOtherPlayerID];
      const newOtherPlayer = newOtherPlayers[newOtherPlayerID];

      if (!newOtherPlayer.pos) continue;

      if (localOtherPlayer) {
        localOtherPlayer.syncRemote(newOtherPlayer.pos, newOtherPlayer.r);
      } else {
        const newLocalOtherPlayer = new OtherPlayer(newOtherPlayerID, newOtherPlayer.pos);
        newLocalOtherPlayer.syncRemote(newOtherPlayer.pos, newOtherPlayer.r);
        otherPlayers[newOtherPlayerID] = newLocalOtherPlayer;
      }
    }
  });
}

function draw() {
  background(0, 0, 0);

  MAP.zoom = lerp(MAP.zoom, player.minR*1.8 / player.r, .1);

  translate(width / 2, height / 2);
  scale(MAP.zoom);
  translate(-player.pos.x, -player.pos.y);

  fill(20);
  stroke(255);
  strokeWeight(2);
  rect(0, 0, MAP.width, MAP.height, MAP.radius);
  noStroke();
  strokeWeight(0);

  blobs.forEach(f => {
    f.draw();
  });

  for (const otherPlayer in otherPlayers) {
    const p = otherPlayers[otherPlayer];
    p.draw();
  }

  player.draw();
  player.update();
  player.sync();
}