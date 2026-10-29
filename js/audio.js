// Sound: effects and a chase tune made with the Web Audio API, plus the recorded voice lines
// (js/voices.js). Browsers only allow sound after a touch, and Android only once the touch has ended,
// so unlock() runs on both the start and the end of a touch.
import { voiceUrl } from "./voices.js";

let ctx = null;
let enabled = true;
let noiseBuffer = null;
const voices = new Map(); // url → decoded AudioBuffer

export function setEnabled(on) {
  enabled = on;
  if (!on) silence();
  else playWantedMusic();
}

export function unlock() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    ctx = new AudioCtx();
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  // The music may have been asked for before sound was allowed: it starts now.
  if (ctx.state === "running") playWantedMusic();
  else ctx.resume().then(playWantedMusic, () => {});
}

function ready() {
  return enabled && ctx && ctx.state === "running";
}

function tone(freq, duration, { type = "square", volume = 0.06, slideTo = null, delay = 0, at = null, out = null } = {}) {
  if (!ready()) return;
  const t0 = at ?? ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(out || ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function noise(duration, { volume = 0.15, filter = 1200, type = "lowpass", delay = 0, at = null, out = null } = {}) {
  if (!ready()) return;
  const t0 = at ?? ctx.currentTime + delay;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = filter;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  src.connect(f).connect(gain).connect(out || ctx.destination);
  src.start(t0);
  src.stop(t0 + duration + 0.02);
}

const SOUNDS = {
  // A turkey's gobble: a fast warble that wobbles down, twice.
  gobble() {
    for (let i = 0; i < 7; i++) tone(560 - i * 32 + (i % 2) * 150, 0.055, { type: "sawtooth", volume: 0.04, delay: i * 0.05 });
    for (let i = 0; i < 5; i++) tone(500 - i * 30 + (i % 2) * 130, 0.05, { type: "sawtooth", volume: 0.03, delay: 0.42 + i * 0.05 });
  },
  jump() {
    tone(260, 0.22, { type: "sine", volume: 0.09, slideTo: 620 });
  },
  slide() {
    noise(0.3, { volume: 0.1, filter: 900, type: "bandpass" });
  },
  lane() {
    noise(0.07, { volume: 0.05, filter: 2400, type: "bandpass" });
  },
  corn() {
    tone(880 + Math.random() * 60, 0.07, { type: "sine", volume: 0.05, slideTo: 1320 });
  },
  pumpkin() {
    [392, 523, 659].forEach((f, i) => tone(f, 0.12, { type: "triangle", volume: 0.08, delay: i * 0.08 }));
  },
  // turbo sneakers: a rising whoosh and a squeak of rubber
  sneakers() {
    noise(0.45, { volume: 0.14, filter: 1400, type: "bandpass" });
    tone(300, 0.4, { type: "sine", volume: 0.07, slideTo: 1400 });
    tone(2200, 0.08, { type: "square", volume: 0.02, delay: 0.38 });
  },
  // the corn magnet: an electric buzz
  magnet() {
    tone(110, 0.45, { type: "sawtooth", volume: 0.04, slideTo: 220 });
    tone(1760, 0.3, { type: "square", volume: 0.012, slideTo: 2640, delay: 0.05 });
  },
  // smashing through something in the turbo sneakers
  smash() {
    noise(0.2, { volume: 0.3, filter: 1800, type: "bandpass" });
    tone(160, 0.18, { type: "square", volume: 0.06, slideTo: 70 });
  },
  shield() {
    tone(700, 0.3, { type: "triangle", volume: 0.08, slideTo: 300 });
    noise(0.2, { volume: 0.2, filter: 1500 });
  },
  bonk() {
    noise(0.15, { volume: 0.35, filter: 600 });
    tone(180, 0.2, { type: "sine", volume: 0.2, slideTo: 60 });
  },
  pan() {
    tone(1200, 0.5, { type: "triangle", volume: 0.07, slideTo: 1150 });
    tone(1810, 0.4, { type: "sine", volume: 0.04 });
  },
  caught() {
    tone(392, 0.2, { type: "triangle", volume: 0.08 });
    tone(330, 0.2, { type: "triangle", volume: 0.08, delay: 0.2 });
    tone(262, 0.6, { type: "triangle", volume: 0.08, slideTo: 200, delay: 0.4 });
  },
  pop() {
    tone(500, 0.08, { type: "sine", volume: 0.06, slideTo: 900 });
  },
  tick() {
    tone(660, 0.05, { type: "square", volume: 0.03 });
  },
  cheer() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.14, { type: "triangle", volume: 0.07, delay: i * 0.12 }));
  },
  fanfare() {
    [523, 523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i === 7 ? 0.5 : 0.12, { type: "triangle", volume: 0.07, delay: i * 0.13 }));
  },
  groan() {
    tone(300, 0.6, { type: "sawtooth", volume: 0.04, slideTo: 120 });
  },
};

export function play(name) {
  SOUNDS[name]?.();
}

// ---------------------------------------------------------------------------------------------
// The chase tune, played quietly while the turkey runs: "Camptown Races" (Stephen Foster, 1850,
// public domain), "Goin' to run all night!". A note is [name, beats]; notes are queued a little
// ahead so they stay in time. It gets faster each day.
const TUNE = [
  // Camptown ladies sing this song, doo-dah, doo-dah
  ["G4", 0.5], ["G4", 0.5], ["E4", 0.5], ["G4", 0.5], ["A4", 0.5], ["G4", 0.5], ["E4", 1], ["E4", 0.5], ["D4", 1.5], ["E4", 0.5], ["D4", 1.5],
  // Camptown racetrack five miles long, oh, doo-dah day
  ["G4", 0.5], ["G4", 0.5], ["E4", 0.5], ["G4", 0.5], ["A4", 0.5], ["G4", 0.5], ["E4", 1], ["D4", 1], ["E4", 0.5], ["D4", 0.5], ["C4", 2],
  // Goin' to run all night, goin' to run all day
  ["C4", 0.75], ["C4", 0.25], ["E4", 0.5], ["G4", 0.5], ["C5", 2], ["A4", 0.75], ["A4", 0.25], ["C5", 0.5], ["A4", 0.5], ["G4", 2],
  // I bet my money on a bobtail nag, somebody bet on the bay
  ["G4", 0.5], ["G4", 0.5], ["E4", 0.5], ["E4", 0.5], ["G4", 0.5], ["G4", 0.5], ["E4", 0.5], ["E4", 0.5],
  ["D4", 0.5], ["E4", 0.5], ["F4", 0.5], ["E4", 0.5], ["D4", 0.5], ["D4", 0.5], ["C4", 1],
];
// the oom-pah under it: the root on the beat, the chord off it (C, F or G, chosen by the melody note)
const BASS = { C: ["C3", "G3"], D: ["G2", "D3"], E: ["C3", "G3"], F: ["F2", "C3"], G: ["C3", "G3"], A: ["F2", "C3"], B: ["G2", "D3"] };

const STEPS = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
function pitch(name) {
  const [, letter, sharp, octave] = /^([A-G])(#?)(\d)$/.exec(name);
  return 440 * 2 ** ((STEPS[letter] + (sharp ? 1 : 0) + (octave - 4) * 12) / 12);
}

const music = { wanted: false, on: false, out: null, timer: null, bpm: 150, i: 0, t: 0, beat: 0 };

// Starts the tune from the top at this speed (beats a minute). Asked for before sound is allowed
// (no touch yet), it starts as soon as unlock() gets it going.
export function startMusic(bpm = 150) {
  silence();
  music.wanted = true;
  music.bpm = bpm;
  music.i = 0;
  playWantedMusic();
}

export function stopMusic() {
  music.wanted = false;
  silence();
}

function playWantedMusic() {
  if (!music.wanted || music.on || !ready()) return;
  music.on = true;
  music.out = ctx.createGain();
  music.out.gain.value = 1;
  music.out.connect(ctx.destination);
  music.t = music.beat = ctx.currentTime + 0.1;
  queueMusic();
}

// Stops what's playing but keeps wanting it, so the next unlock() picks it up again.
function silence() {
  if (!music.on) return;
  music.on = false;
  clearTimeout(music.timer);
  const out = music.out;
  out.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05);
  setTimeout(() => out.disconnect(), 400);
}

function queueMusic() {
  if (!music.on || !ready()) {
    silence();
    return;
  }
  const ahead = ctx.currentTime + 0.4;
  const beat = 60 / music.bpm;
  let last = "C4";
  while (music.t < ahead) {
    if (music.i >= TUNE.length) {
      music.i = 0;
      music.t += beat; // a breath, then round again
      continue;
    }
    const [name, beats] = TUNE[music.i++];
    last = name;
    tone(pitch(name), beats * beat * 0.8, { type: "square", volume: 0.022, at: music.t, out: music.out });
    tone(pitch(name) * 2, Math.min(0.08, beats * beat * 0.4), { type: "triangle", volume: 0.015, at: music.t, out: music.out });
    music.t += beats * beat;
  }
  while (music.beat < ahead) {
    const [root, fifth] = BASS[(TUNE[Math.max(0, music.i - 1)] || [last])[0][0]];
    tone(pitch(root), beat * 0.4, { type: "triangle", volume: 0.06, at: music.beat, out: music.out });
    tone(pitch(fifth), beat * 0.25, { type: "triangle", volume: 0.03, at: music.beat + beat / 2, out: music.out });
    noise(0.04, { volume: 0.02, filter: 7000, type: "highpass", at: music.beat + beat / 2, out: music.out });
    music.beat += beat;
  }
  music.timer = setTimeout(queueMusic, 150);
}

// ---------------------------------------------------------------------------------------------
// Says one of the recorded lines (js/voices.js), fetched and decoded the first time it is needed.
// One voice at a time: a new line cuts off the last one.
let speaking = null;

export async function say(id) {
  const url = voiceUrl(id);
  if (!url || !ready()) return false;
  try {
    let buffer = voices.get(url);
    if (!buffer) {
      const bytes = await (await fetch(url)).arrayBuffer();
      buffer = await ctx.decodeAudioData(bytes);
      voices.set(url, buffer);
    }
    try {
      speaking?.stop();
    } catch {
      // it had already finished
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start();
    speaking = src;
    return true;
  } catch {
    return false;
  }
}
