const players = [];
const foods = [];

class Sprite {
  isTouching(s, me = this) {
    const d = dist(me.x, me.y, s.x, s.y);
    return d < (me.r + s.r);
  }

  randomCoord() {
    return round(random(this.w, width - this.w));
  }
}

class Food extends Sprite {
  constructor() {
    super();

    this.r = 5;
    this.w = this.r * 2;
    this.h = this.r * 2;
    this.color = `rgb(${round(random(255))}, ${round(random(255))}, ${round(random(255))})`;

    const [x, y] = this.randomFoodCoords();
    this.x = x;
    this.y = y;

    foods.push(this);
  }

  randomFoodCoords() {
    let touching = true;

    let newX;
    let newY;

    while(touching) {
      const x = this.randomCoord();
      const y = this.randomCoord();

      for (let i = 0; i < players.length; i++) {
        const p = players[i];

        if (this.isTouching(p, { x, y, r: (this.r * 4) })) {
          touching = true;
          break;
        }

        newX = x;
        newY = y;
        touching = false;
      }
    }

    return [newX, newY];
  }

  realX() {
    return this.x - (this.w / 2);
  }

  realY() {
    return this.y - (this.h / 2);
  }

  remove() {
    const i = foods.indexOf(this);
    foods.splice(i, 1);
  }

  draw() {
    fill(this.color);

    if (this.x && this.y) {
      ellipse(this.x, this.y, this.w, this.h);
    }

    players.forEach(p => {
      if (this.isTouching(p)) {
          this.remove();
          p.grow();
        }
    });
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.r = round(windowHeight / 20);
    this.w = this.r * 2;
    this.h = this.r * 2;
    this.x = random(this.w, width - this.w);
    this.y = random(this.h, height - this.h);
    this.step = 2;

    players.push(this);
  }

  draw() {
    fill(255, 255, 255);
    ellipse(this.x, this.y, this.w, this.h);
    fill(0, 0, 0);
    text(this.name, this.x, this.y);
    text(this.w, this.x, this.y + this.w / 5);
    textSize(this.w / 5);

    this.movementLogic();
  }

  shrink(count = 1) {
    if (this.w <= 50) return;

    this.w -= count;
    this.h -= count;
    this.r -= (count / 2)
  }

  grow(count = 3) {
    this.w += count;
    this.h += count;
    this.r += (count / 2)
  }

  moveRight() {
    this.x += this.step;
  }

  moveLeft() {
    this.x -= this.step;
  }

  moveDown() {
    this.y += this.step;
  }

  moveUp() {
    this.y -= this.step;
  }

  realX() {
    return this.x - (this.w / 2);
  }

  realY() {
    return this.y - (this.h / 2);
  }

  movementLogic() {
    if (keyIsDown(LEFT_ARROW)) {
      if (this.realX() > 0) {
        this.moveLeft();
      }
    }

    if (keyIsDown(RIGHT_ARROW)) {
      if (this.realX() < (width - this.w)) {
        this.moveRight();
      }
    }

    if (keyIsDown(UP_ARROW)) {
      if (this.realY() > 0) {
        this.moveUp();
      }
    }

    if (keyIsDown(DOWN_ARROW)) {
      if (this.realY() < (height - this.h)) {
        this.moveDown();
      }
    }
  }
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  new Player("Ruth");

  players.forEach(player => {
    setInterval(() => { player.shrink() }, 500);
  });

  setInterval(() => {
    new Food();
  }, 100);
}

function draw() {
  background(0, 0, 0);
  ellipseMode(CENTER);
  textAlign(CENTER);

  foods.forEach(f => {
    f.draw();
  });

  players.forEach(p => {
    p.draw();
  });
}