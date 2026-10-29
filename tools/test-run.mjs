// Runs the play screen with no screen at all, with a robot player that jumps, ducks and dodges
// whatever is in its lane, to check every day can be got through and nothing gets stuck.
//   node tools/test-run.mjs [runs per day]
const stub = () => {
  const store = {};
  const p = new Proxy(function () {}, {
    get: (_, k) => (k in store ? store[k] : k === Symbol.toPrimitive ? () => 0 : p),
    set: (_, k, v) => ((store[k] = v), true),
    apply: () => p,
  });
  return p;
};
const rand = (a, b) => a + Math.random() * (b - a);
globalThis.Phaser = {
  Scene: class {
    constructor() {
      this.add = stub(); this.tweens = stub(); this.textures = { exists: () => false }; this.cameras = stub(); this.input = stub(); this.events = stub();
      this.time = { paused: false, delayedCall: () => {}, addEvent: () => {} };
      this.scene = { isActive: () => true, start: (key, data) => (this.next = { key, data }), pause() {}, launch() {}, resume() {} };
    }
  },
  Math: {
    Clamp: (v, a, b) => Math.min(b, Math.max(a, v)), FloatBetween: rand,
    Between: (a, b) => Math.floor(rand(a, b + 1)), DegToRad: (d) => (d * Math.PI) / 180,
  },
  Utils: { Array: { Shuffle: (a) => a.sort(() => Math.random() - 0.5), GetRandom: (a) => a[Math.floor(Math.random() * a.length)] } },
};
globalThis.document = { addEventListener() {}, removeEventListener() {}, hidden: false };
globalThis.localStorage = { getItem: () => JSON.stringify({ player: { id: "t", initials: "BOT" }, totals: { runs: 5 } }), setItem() {} };
globalThis.window = globalThis;

const { PlayScene } = await import("../js/scenes/PlayScene.js");
const { DAYS } = await import("../js/rules.js");

function play(day) {
  const s = new PlayScene();
  s.create({ day, score: 0, corn: 0, shield: false });
  for (let frame = 0; frame < 60 * 120; frame++) {
    s.update(0, 1000 / 60);
    if (s.phase !== "run") break;
    for (const t of s.things) {
      const z = t.at - s.distance;
      if (t.kind === "prop" || t.done || t.seen || Math.abs(t.lane - s.lane) > 0.5 || z > 4 || z < 0) continue;
      t.seen = true;
      if (t.kind === "jump") s.act("up");
      else if (t.kind === "duck") s.act("down");
      else if (t.kind === "block") {
        const free = [-1, 0, 1].filter((l) => l !== s.lane && !s.things.some((o) => o.kind === "block" && o.lane === l && Math.abs(o.at - s.distance) < 6));
        s.act(free[0] < s.lane ? "left" : "right");
      }
    }
  }
  return { phase: s.phase, distance: Math.round(s.distance), corn: s.run.corn, score: Math.round(s.run.score), secs: Math.round(s.clock) };
}

const runs = Number(process.argv[2]) || 20;
for (const [i, d] of DAYS.entries()) {
  const results = Array.from({ length: runs }, () => play(i));
  const made = results.filter((r) => r.phase === "made-it").length;
  const avg = (k) => Math.round(results.reduce((n, r) => n + r[k], 0) / runs);
  console.log(`${d.name.padEnd(12)} robot made it ${made}/${runs}  ~${avg("secs")}s  corn ${avg("corn")}  score ${avg("score")}`);
}
