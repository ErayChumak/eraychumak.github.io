let newPoses = {};

class OtherPlayer {
  constructor(player) {
    this.id = player.id;
    this.dead = false;
    this.name = player.name;
    this.r = player.r;
    this.minR = 64;
    this.pos = createVector(player.pos.x, player.pos.y);

    this.color = `rgb(${this.rgb.r}, ${round(this.rgb.g)}, ${this.rgb.b})`;
    this.darkerColor = `rgb(${this.rgb.r - 50}, ${round(this.rgb.g - 50)}, ${this.rgb.b - 50})`;

    allPlayersArrangement.push(this);
    allPlayersArrangement = allPlayersArrangement.sort((p1, p2) => p1.r - p2.r);
  }

  draw() {
    if (newPoses[this.id]) {
      this.pos.lerp(newPoses[this.id], .1);
    }

    const strokeSize = MAP.zoom * 4;

    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    fill(this.darkerColor);
    ellipse(this.pos.x, this.pos.y, (this.r * 2) - (strokeSize), this.r * 2 - (strokeSize));

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

    if (this.isEdibleBy(player) && !this.dead) {
      socket.emit("eat", this.id);
      player.grow(this.r);
      this.dead = true;
    }
  }

  isEdibleBy(otherBlob) {
    if (this.r + (this.r / 4) >= otherBlob.r) return false;
    const d = dist(this.pos.x, this.pos.y, otherBlob.pos.x, otherBlob.pos.y);
    return d < otherBlob.r;
  }

  syncNewUpdates(otherPlayer) {
    const target = createVector(otherPlayer.pos.x, otherPlayer.pos.y);
    newPoses[this.id] = target;

    this.name = otherPlayer.name;
    this.r = otherPlayer.r;
  }
}