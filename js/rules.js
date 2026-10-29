// How each day plays: how fast, how far, what's in the way. Tune the game here.
// Distances are in steps. A day of 650 steps at 13 to 15 a second takes about 45 seconds;
// node tools/test-run.mjs has a robot run every day to check it can be got through.
//
// Obstacles come in three sorts: JUMP over it (swipe up), DUCK under it (swipe down), or it
// BLOCKS the lane and you must swipe around it. Clipping a jump or duck one is a stumble: the
// farmer catches up, and a second stumble while he's close gets you caught. Running into a
// blocker gets you caught straight away. Power-ups (POWERS): a pumpkin takes one hit, sneakers smash through
// anything, a magnet pulls in the corn.
export const KINDS = {
  fence: "jump", hay: "jump", puddle: "jump", crate: "jump",
  line: "duck", banner: "duck",
  tractor: "block", wagon: "block", truck: "block",
};

export const DAYS = [
  {
    id: "farm", name: "MONDAY", short: "MON", place: "The Farm", note: "3 days till Thanksgiving",
    speed: 13, speedUp: 2, length: 650, gap: [17, 24], pairs: 0.2,
    obstacles: ["fence", "hay", "line", "puddle", "tractor"], props: ["tree", "tree", "scarecrow"],
    sky: [0x8fd0f0, 0xd8f0ff], hills: 0x8cc152, grass: [0x7aa840, 0x6f9c38], road: [0xb98a52, 0xae7f48],
  },
  {
    id: "corn", name: "TUESDAY", short: "TUE", place: "The Cornfield", note: "2 days till Thanksgiving",
    speed: 16, speedUp: 2, length: 750, gap: [15, 21], pairs: 0.35,
    obstacles: ["hay", "crate", "banner", "line", "tractor", "wagon"], props: ["scarecrow", "scarecrow", "tree"],
    sky: [0x9cc8ec, 0xfff0c8], hills: 0xd9b44a, grass: [0xc9a640, 0xbd9a38], road: [0x9c7446, 0x926b3f],
  },
  {
    id: "town", name: "WEDNESDAY", short: "WED", place: "Into Town", note: "Thanksgiving is TOMORROW!",
    speed: 19, speedUp: 2, length: 850, gap: [14, 19], pairs: 0.5,
    obstacles: ["crate", "puddle", "banner", "line", "truck", "wagon"], props: ["house", "lamp"],
    sky: [0x86b8e0, 0xf6d8b8], hills: 0x7a8aa0, grass: [0x88aa55, 0x7d9e4d], road: [0x777777, 0x6d6d6d],
  },
  {
    id: "feast", name: "THANKSGIVING", short: "THU", place: "The Big Day", note: "The farmer's right behind you!",
    speed: 21, speedUp: 3, length: 1000, gap: [13, 18], pairs: 0.55, boss: true,
    obstacles: ["fence", "hay", "crate", "puddle", "line", "banner", "tractor", "truck", "wagon"], props: ["tree", "house"],
    sky: [0xf08a3c, 0xffd28a], hills: 0xa0522d, grass: [0xa9743a, 0x9d6a34], road: [0xcfa772, 0xc39b66],
  },
];

export const POINTS = {
  step: 1,         // every step run
  corn: 10,        // each ear of corn
  day: 500,        // reaching the end of a day
  pardon: 2500,    // surviving Thanksgiving
};

export const STUMBLE_MS = 7000; // the farmer stays close this long after a stumble
export const CORN_CHANCE = 0.6; // a row brings a line of corn
// Power-ups turn up in an empty lane. Each lasts this many seconds, and only on the day it's picked up.
// One at a time: picking up a new one replaces the one going.
export const POWERS = {
  pumpkin: { seconds: 12, chance: { normal: 0.03, boss: 0.07 }, says: "PUMPKIN SHIELD!" },   // takes one hit for you
  sneakers: { seconds: 6, chance: { normal: 0.025, boss: 0.03 }, says: "TURBO SNEAKERS!" }, // super fast, smash through anything
  magnet: { seconds: 10, chance: { normal: 0.03, boss: 0.03 }, says: "CORN MAGNET!" },      // pulls in the corn from every lane
};
export const TURBO = 1.6; // how much faster the sneakers run
