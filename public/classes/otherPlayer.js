let newPoses = {};

class OtherPlayer {
  constructor(player) {
    this.id = player.id;
    this.dead = false;
    this.name = player.name;
    this.r = player.r;
    this.minR = 64;
    this.pos = createVector(player.pos.x, player.pos.y);
    this.color = `rgba(${round(random(255))}, ${round(random(255))}, ${round(random(255))}, 1)`;

    allPlayersArrangement.push(this);
    allPlayersArrangement = allPlayersArrangement.sort((p1, p2) => p1.r - p2.r);
  }

  draw() {
    stroke(255);
    strokeWeight(2);
    fill(this.color);

    if (newPoses[this.id]) {
      this.pos.lerp(newPoses[this.id], .1);
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