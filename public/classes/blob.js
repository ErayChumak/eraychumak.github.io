class Blob {
  constructor() {
    this.r = 16;
    this.color = `rgb(${round(random(255))}, ${round(random(255))}, ${round(random(255))})`;

    const [x, y] = this.randomFoodCoords();
    this.pos = createVector(x, y);

    blobs.push(this);
  }

  draw() {
    if (this.pos.x && this.pos.y) {
      fill(this.color);
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }

    if (this.isTouching(player)) {
      this.remove();
      player.grow(this.r);
      setTimeout(() => new Blob(), random(500, 1000));
    }
  }

  randomFoodCoords() {
    let touching = true;

    let newX;
    let newY;

    while(touching) {
      const x = this.randomCoord();
      const y = this.randomCoord();

      if (this.checkIfTouching({ x, y, r: this.r }, player)) {
        touching = true;
        break;
      }

      newX = x;
      newY = y;
      touching = false;
    }

    return [newX, newY];
  }

  remove() {
    const i = blobs.indexOf(this);
    blobs.splice(i, 1);
  }

  checkIfTouching(newPos, otherBlob) {
    const d = dist(newPos.x, newPos.y, otherBlob.pos.x, otherBlob.pos.y);
    return d < (newPos.r + otherBlob.r);
  }

  isTouching(otherBlob) {
    const d = dist(this.pos.x, this.pos.y, otherBlob.pos.x, otherBlob.pos.y);
    return d < (this.r + otherBlob.r);
  }

  randomCoord() {
    return round(random(this.r, MAP.width));
  }
}