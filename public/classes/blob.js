class FoodBlob {
  constructor(id, r, color, pos) {
    this.id = id;
    this.r = r;
    this.color = color;
    this.pos = createVector(pos.x, pos.y);
  }

  draw() {
    if (this.pos.x && this.pos.y) {
      fill(this.color);
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }

    if (this.isTouching(player)) {
      socket.emit("blobEaten", this.id);
      player.grow(this.r);
    }
  }

  isTouching(otherBlob) {
    const d = dist(this.pos.x, this.pos.y, otherBlob.pos.x, otherBlob.pos.y);
    return d < (this.r + otherBlob.r);
  }
}