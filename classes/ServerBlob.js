class ServerBlob {
  constructor(id) {
    this.id = id;
    this.r = Math.random() * (18 - 8) + 8;
    this.color = `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`;
    this.randomisePos();
  }

  randomisePos() {
    this.pos = {
      x: Math.random() * 5000,
      y: Math.random() * 5000
    }

    return this.pos;
  }
}

module.exports = {
  ServerBlob
};
