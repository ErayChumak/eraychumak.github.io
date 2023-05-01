const MAP = {
  width: 5_000,
  height: 5_000
};

let player;

const blobs = [];

class Sprite {
  isTouching(s, me = this) {
    const d = dist(me.pos.x, me.pos.y, s.pos.x, s.pos.y);
    return d < (me.r + s.r);
  }

  randomCoord() {
    return round(random(this.r, MAP.width));
  }
}

class Blob extends Sprite {
  constructor() {
    super();
    this.r = 16;
    this.color = `rgb(${round(random(255))}, ${round(random(255))}, ${round(random(255))})`;

    const [x, y] = this.randomFoodCoords();
    this.pos = createVector(x, y);

    blobs.push(this);
  }

  draw() {
    if (this.pos.x && this.pos.y) {
      fill(this.color);
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }

    if (this.isTouching(player)) {
      this.remove();
      player.grow(this.r);
      setTimeout(() => new Blob(), random(500, 1000));
    }
  }

  randomFoodCoords() {
    let touching = true;

    let newX;
    let newY;

    while(touching) {
      const x = this.randomCoord();
      const y = this.randomCoord();

      if (this.isTouching(player, { pos: {x, y,}, r: this.r })) {
        touching = true;
        break;
      }

      newX = x;
      newY = y;
      touching = false;
    }

    return [newX, newY];
  }

  remove() {
    const i = blobs.indexOf(this);
    blobs.splice(i, 1);
  }

}

class Player {
  constructor() {
    this.r = 64;
    this.name = "Ruth";
    this.pos = createVector(0, 0);
    this.color = `rgb(${round(random(255))}, ${round(random(255))}, ${round(random(255))})`;
  }

  draw() {
    stroke(255);
    strokeWeight(2);
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);

    noStroke();
    strokeWeight(0);
    fill(0);
    textAlign(CENTER);
    textSize(this.r / 4);
    text(round(this.r), this.pos.x, this.pos.y + (this.r / 3));
    textSize(this.r / 3);
    text(this.name, this.pos.x, this.pos.y);
  }

  grow(count) {
    const sum = (PI * (this.r ** 2)) + (PI * (count ** 2));
    const newRadius = sqrt(sum / PI);

    this.r = newRadius;
  }

  update() {
    let newX = mouseX - ((width / 2) - this.pos.x);
    let newY = mouseY - ((height / 2) - this.pos.y);

    newX = constrain(newX, 0, MAP.width);
    newY = constrain(newY, 0, MAP.height);

    const newPos = createVector(newX, newY);

    newPos.sub(this.pos);
    newPos.setMag(3);

    this.pos.add(newPos);
  }
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.style("display", "block");
  player = new Player();

  for (let x = 0; x < 1_000; x++) {
    new Blob();
  }
}

function draw() {
  background(0, 0, 0);

  translate((width / 2) - player.pos.x, (height / 2) - player.pos.y);

  fill(20);
  stroke(255);
  strokeWeight(2);
  rect(0, 0, MAP.width, MAP.height);
  noStroke();
  strokeWeight(0);

  player.draw();
  player.update();

  blobs.forEach(f => {
    f.draw();
  });
}