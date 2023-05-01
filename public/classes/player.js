class Player {
  constructor() {
    this.r = 64;
    this.minR = 64;
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
    newPos.setMag(4);

    this.pos.add(newPos);
  }
}