class FoodBlob {
  constructor(id, r, color, pos) {
    this.id = id;
    this.r = r;
    this.eaten = false;
    this.color = color;
    this.pos = createVector(pos.x, pos.y);
  }

  respawn(newPos) {
    this.pos = createVector(newPos.x, newPos.y);
    this.eaten = false;
  }

  hide() {
    this.eaten = true;
  }

  draw() {
    if (this.eaten) return;

    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);

    if (this.isTouching(player)) {
      socket.emit("blobEaten", this.id);
    }
  }

  isTouching(otherBlob) {
    const d = dist(this.pos.x, this.pos.y, otherBlob.pos.x, otherBlob.pos.y);
    return d < (this.r + otherBlob.r);
  }
}