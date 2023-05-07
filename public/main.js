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

  connectToServer();

  setInterval(() => {
    fR = round(frameRate());
  }, 1000);
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

  // ? WORLD ZOOM - START
  push()
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

  allPlayersArrangement.forEach(p => {
    p.draw();
  });

  player.update();
  pop();
  // ? WORLD ZOOM - END

  let sum = 0;

  for (let knownBlobID in knownBlobs) {
    const b = knownBlobs[knownBlobID];

    if (b.eaten) {
      continue;
    }

    sum += 1;
  }

  // ? HUD - START
  push();
  translate(-(width / 2), -(height / 2));
  scale(MAP.zoom - (MAP.zoom - 1));
  textSize(16);
  text(`HUD SCALE: ${MAP.zoom - (MAP.zoom - 1)}`, 0, 15);
  text(`WORLD ZOOM: ${round(MAP.zoom, 2)}`, 0, 30);
  text(`FOOD ON MAP: ${sum}`, 0, 45);
  text(`FPS: ${fR} / ${getTargetFrameRate()}`, 0, 60);
  text(`LATENCY: ${latency}ms`, 0, 75);
  pop();
  // ? HUD - END

  player.sync();
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    reqChangeName = true;
  }
}