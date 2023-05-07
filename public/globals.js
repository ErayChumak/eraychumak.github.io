const socket = io();

const MAP = {
  width: 5_000,
  height: 5_000,
  radius: 0,
  zoom: 1
};

let player;
const knownPlayers = {};
const knownBlobs = {};

/*
  Draw players relative to their radius
  so they over-lap correctly based on size.
*/
let allPlayersArrangement = [];

let reqChangeName = false;
let playing = false;
let font;
let fR = 0;
let latency = 0;
