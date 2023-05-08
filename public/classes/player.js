class Player {
  constructor(name, pos) {
    this.name = name;
    this.r = 64;
    this.minR = 64;
    this.pos = createVector(pos.x, pos.y);

    this.rgb = {
      r: round(random(100, 255)),
      g: round(random(100, 255)),
      b: round(random(100, 255)),
    };

    this.color = `rgb(${this.rgb.r}, ${round(this.rgb.g)}, ${this.rgb.b})`;
    this.darkerColor = `rgb(${this.rgb.r - 50}, ${round(this.rgb.g - 50)}, ${this.rgb.b - 50})`;

    allPlayersArrangement.push(this);
    allPlayersArrangement = allPlayersArrangement.sort((p1, p2) => p1.r - p2.r);
  }

  draw() {
    push();
    const strokeSize = MAP.zoom * 10;

    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    fill(this.darkerColor);
    ellipse(this.pos.x, this.pos.y, (this.r * 2) - strokeSize, (this.r * 2) - strokeSize);

    fill(0);
    textAlign(CENTER);

    // name
    textSize(this.r / 3);
    text(this.name, this.pos.x, this.pos.y);

    // points
    textSize(this.r / 4);
    text(round(this.r), this.pos.x, this.pos.y + (this.r / 3));

    stroke(255);
    strokeWeight(2);
    line(this.pos.x - this.r, this.pos.y - this.r, this.pos.x + this.r, this.pos.y - this.r); // top
    line(this.pos.x - this.r, this.pos.y + this.r, this.pos.x + this.r, this.pos.y + this.r); // bottom
    line(this.pos.x - this.r, this.pos.y - this.r, this.pos.x - this.r, this.pos.y + this.r); // left
    line(this.pos.x + this.r, this.pos.y - this.r, this.pos.x + this.r, this.pos.y + this.r); // right
    fill(255);
    text(round(this.r * 2), this.pos.x, this.pos.y + this.r + (this.r * .5));
    pop();
  }

  grow(count) {
    const sum = (PI * (this.r ** 2)) + (PI * (count ** 2));
    const newRadius = sqrt(sum / PI);

    this.r = newRadius;
    allPlayersArrangement = allPlayersArrangement.sort((p1, p2) => p1.r - p2.r);
  }

  update() {
    const goTo = createVector(
      constrain(this.pos.x + (mouseX / MAP.zoom) - width / (MAP.zoom * 2), 0, MAP.width),
      constrain(this.pos.y + (mouseY / MAP.zoom) - height / (MAP.zoom * 2), 0, MAP.height)
    );

    // ? MOUSE LINE - START
    push();
    scale(MAP.zoom - (MAP.zoom - 1));
    beginShape();
    strokeWeight(2);
    stroke(255);
    line(this.pos.x, this.pos.y, goTo.x, goTo.y);
    endShape();
    pop();
    // ? MOUSE LINE - END

    const dBetweenPlayerAndGoTo = dist(this.pos.x, this.pos.y, goTo.x, goTo.y);

    goTo.sub(this.pos);

    if (dBetweenPlayerAndGoTo <= (this.r / 2)) {
      goTo.setMag(1);
    } else {
      goTo.setMag(3 * (deltaTime * 0.1));
    }

    this.pos.add(goTo);
  }

  sync() {
    socket.emit("updatePlayer", {
      name: this.name,
      pos: this.pos,
      r: this.r,
      rgb: this.rgb
    });
  }
}