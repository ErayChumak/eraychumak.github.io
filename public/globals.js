const MAP = {
  width: 5_000,
  height: 5_000,
  radius: 0,
  zoom: 1
};

let player;

const blobs = [];

/*
  Draw players relative to their radius
  so they over-lap correctly based on size.
*/
let allPlayersArrangement = [];
