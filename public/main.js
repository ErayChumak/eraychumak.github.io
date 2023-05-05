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

  socket.on("eaten", () => {
    playing = false;
    prompt("You have been eaten! Continuing will re-spawn you.");
    location.reload();
  });

  socket.on("allBlobs", (serverBlobs) => {
    for (const serverBlobID in serverBlobs) {
      const b = serverBlobs[serverBlobID];
      knownBlobs[serverBlobID] = new FoodBlob(serverBlobID, b.r, b.color, b.pos);
    }
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

      // the client
      if (serverPlayerID === socket.id) {
        if (!player) {
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

function draw() {
  if (!playing || !player) return;

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

  for (const blobID in knownBlobs) {
    const b = knownBlobs[blobID];
    b.draw();
  }

  // blobs.forEach(f => {
  //   f.draw();
  // });

  allPlayersArrangement.forEach(p => {
    p.draw();
  });

  player.update();
  player.sync();

}

function keyPressed() {
  if (keyCode === ESCAPE) {
    reqChangeName = true;
  }
}