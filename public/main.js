const socket = io();

let reqChangeName = false;
let playing = false;

let knownPlayers = {};
let font;

function preload() {
  font = loadFont("./assets/sofia_sans_regular.ttf");
}

function setup() {
  const username = getItem("username");

  if (!username) {
    playing = false;
    const newUsername = prompt("Choose a username");

    if (newUsername) {
      storeItem("username", newUsername);
    }

    playing = true;
  } else {
    playing = true;
  }

  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.style("display", "block");

  textFont(font);

  MAP.radius = windowWidth / 100;

  player = new Player(getItem("username") || "Unnamed Blob");

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
  if (!playing) return;

  if (reqChangeName) {
    noLoop();
    playing = false;
    const newUsername = prompt("Choose a username");

    if (newUsername) {
      storeItem("username", newUsername);
      player.name = newUsername;
    } else {
      removeItem("username");
      player.name = "Unnamed Blob";
    }

    playing = true;
    reqChangeName = false;
    loop();
  }

  background(0);

  MAP.zoom = lerp(MAP.zoom, (player.minR * 1.8) / player.r, .1);

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

function keyPressed() {
  if (keyCode === ESCAPE) {
    reqChangeName = true;
  }
}