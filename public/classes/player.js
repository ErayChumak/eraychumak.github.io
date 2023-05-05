class Player {
  constructor(name) {
    this.name = name;
    this.r = 64;
    this.minR = 64;
    this.pos = createVector(0, 0);
    this.color = `rgb(${round(random(100, 255))}, ${round(random(100, 255))}, ${round(random(100, 255))})`;

    allPlayersArrangement.push(this);
    allPlayersArrangement = allPlayersArrangement.sort((p1, p2) => p1.r - p2.r);
  }

  draw() {
    stroke(255);
    strokeWeight(MAP.zoom * 4);
    fill(this.color);

    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);

    noStroke();
    strokeWeight(0);
    fill(0);
    textAlign(CENTER);
    textSize(this.r / 3);
    stroke(255);
    strokeWeight(this.r * 0.03);
    text(this.name, this.pos.x, this.pos.y);
    textSize(this.r / 4);
    text(round(this.r), this.pos.x, this.pos.y + (this.r / 3));
  }

  grow(count) {
    const sum = (PI * (this.r ** 2)) + (PI * (count ** 2));
    const newRadius = sqrt(sum / PI);

    this.r = newRadius;
    allPlayersArrangement = allPlayersArrangement.sort((p1, p2) => p1.r - p2.r);
  }

  update() {
    let newX = mouseX - ((width / 2) - this.pos.x);
    let newY = mouseY - ((height / 2) - this.pos.y);

    newX = constrain(newX, 0, MAP.width);
    newY = constrain(newY, 0, MAP.height);

    const newPos = createVector(newX, newY);

    newPos.sub(this.pos);
    newPos.setMag(5);

    this.pos.add(newPos);
  }

  sync() {
    socket.emit("updatePlayer", {
      name: this.name,
      pos: this.pos,
      r: this.r
    });
  }
}