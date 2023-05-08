class ServerPlayer {
  constructor(id) {
    this.id = id;
    this.name = "An unnamed blob";
    this.r = 64;
    this.minR = 64;

    this.pos = {
      x: Math.random() * 5000,
      y: Math.random() * 5000
    };
  }

  update(player) {
    this.name = player.name;
    this.r = player.r;
    this.rgb = player.rgb;

    this.pos = {
      x: player.pos.x,
      y: player.pos.y
    }
  }
}

module.exports = {
  ServerPlayer
};

