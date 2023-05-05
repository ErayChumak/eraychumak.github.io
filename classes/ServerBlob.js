class ServerBlob {
  constructor(id) {
    this.id = id;
    this.r = 16;
    this.color = `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`;
    this.randomise();
  }

  randomise() {
    this.pos = {
      x: Math.random() * 5000,
      y: Math.random() * 5000
    }
  }
}

module.exports = {
  ServerBlob
};
