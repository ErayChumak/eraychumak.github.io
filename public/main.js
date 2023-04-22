const players = [];
const foods = [];

class Food {
  constructor() {
    this.w = 10;
    this.h = 10;
    this.color = `rgb(${round(random(255))}, ${round(random(255))}, ${round(random(255))})`;
    this.x = round(random((this.w / 2), width - (this.w / 2)));
    this.y = round(random((this.h / 2), height - (this.h / 2)));

    foods.push(this);
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
    rect(this.x, this.y, this.w, this.h, this.w / 2);

    players.forEach(p => {
      if ((p.realX() + p.w) >= this.realX() && p.realX() <= (this.realX() + this.w)) {
        if ((p.realY() + p.h) >= this.realY() && p.realY() <= (this.realY() + this.h)) {
          this.remove();
          p.grow();
        }
      }
    });
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.w = round(windowHeight / 20);
    this.h = round(windowHeight / 20);
    this.x = this.w / 2;
    this.y = this.h / 2;
    this.step = 2;

    players.push(this);
  }

  draw() {
    fill(255, 255, 255);
    rect(this.x, this.y, this.w, this.h, this.w / 2);
    fill(0, 0, 0);
    text(this.name, this.x, this.y);
    text(this.w, this.x, this.y + this.w / 5);
    textSize(this.w / 5);
    this.movementLogic();
  }

  grow() {
    this.w += 5;
    this.h += 5;
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

  setInterval(() => {
    new Food();
  }, 100);
}

function draw() {
  background(0, 0, 0);
  rectMode(CENTER);
  textAlign(CENTER);

  foods.forEach(f => {
    f.draw();
  });

  players.forEach(p => {
    p.draw();
  });
}