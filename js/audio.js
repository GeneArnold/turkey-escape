// Sound: placeholder effects made with the Web Audio API.
// Browsers only allow sound after a touch, and Android only once the touch has ended, so unlock()
// runs on both the start and the end of a touch.
let ctx = null;
let enabled = true;
let noiseBuffer = null;

export function setEnabled(on) {
  enabled = on;
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
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
}

function ready() {
  return enabled && ctx && ctx.state === "running";
}

function tone(freq, duration, { type = "square", volume = 0.06, slideTo = null, delay = 0 } = {}) {
  if (!ready()) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function noise(duration, { volume = 0.15, filter = 1200, type = "lowpass", delay = 0 } = {}) {
  if (!ready()) return;
  const t0 = ctx.currentTime + delay;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = filter;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  src.connect(f).connect(gain).connect(ctx.destination);
  src.start(t0);
  src.stop(t0 + duration + 0.02);
}

const SOUNDS = {
  gobble() {
    for (let i = 0; i < 5; i++) {
      const f = 380 + Math.random() * 120;
      tone(f, 0.06, { type: "sawtooth", volume: 0.045, slideTo: f * 0.6, delay: i * 0.07 });
    }
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
