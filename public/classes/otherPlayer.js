let newPoses = {};

class OtherPlayer {
  constructor(name, pos) {
    this.name = name;
    this.r = 640;
    this.minR = 64;
    this.pos = createVector(pos.x, pos.y);
    this.color = `rgb(${round(random(255))}, ${round(random(255))}, ${round(random(255))})`;
  }

  draw() {
    stroke(255);
    strokeWeight(2);
    fill(this.color);

    if (newPoses[this.name]) {
      this.pos.lerp(newPoses[this.name], .1);
    }

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

  syncRemote(newPos, newR) {
    const target = createVector(newPos.x, newPos.y);
    newPoses[this.name] = target;
    this.r = newR;
  }
}