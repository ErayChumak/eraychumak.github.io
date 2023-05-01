function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.style("display", "block");

  MAP.radius = windowWidth / 100;

  player = new Player();

  for (let x = 0; x < 1_000; x++) {
    new Blob();
  }
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

  player.draw();
  player.update();

  blobs.forEach(f => {
    f.draw();
  });
}