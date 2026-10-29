// Records the spoken lines in js/voices.js with Chatterbox on cerebro.
// Run from the project folder:  node tools/make-voices.mjs [--force] [--only id,id] [--samples]
// Writes voices/<id>.mp3. Lines already recorded are skipped unless --force is given.
// --samples records one line of each character in several voices into art/source/voice-samples/,
// for picking a voice; then set WHO below and run --force.
//
// Chatterbox speaks at normal speed (its speed setting smears the audio); then the clip is played back
// faster or slower ("asetrate"), which moves pitch and speed together, cartoon style.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { LINES } from "../js/voices.js";

const CHATTERBOX = process.env.CHATTERBOX_URL || "http://192.168.40.110:8004";
const SAMPLE_RATE = 24000;

// Each character's Chatterbox voice, and the playback rate (above 1 = higher and quicker).
const WHO = {
  turkey: { voice: "Ryan.wav", pitch: 1.3 },
  farmer: { voice: "Everett.wav", pitch: 0.9 },
};
const SAMPLE_VOICES = {
  turkey: ["Ryan.wav", "Ian.wav", "Miles.wav", "Eli.wav"],
  farmer: ["Everett.wav", "Thomas.wav", "Michael.wav", "Austin.wav"],
};

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;
const tmp = "voices/.raw.wav";
mkdirSync("voices", { recursive: true });

async function record(text, { voice, pitch }, out) {
  const res = await fetch(`${CHATTERBOX}/v1/audio/speech`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: "chatterbox", input: text, voice, response_format: "wav", speed: 1.0 }),
  });
  if (!res.ok) throw new Error(`Chatterbox said HTTP ${res.status} for "${text}" (${voice})`);
  writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
  // change the pitch, trim the silence at both ends, and even out the loudness between clips
  const filters = [
    `asetrate=${SAMPLE_RATE}*${pitch}`, `aresample=${SAMPLE_RATE}`,
    "silenceremove=start_periods=1:start_threshold=-45dB", "areverse",
    "silenceremove=start_periods=1:start_threshold=-45dB", "areverse", "loudnorm=I=-16:TP=-1.5",
  ].join(",");
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", tmp, "-af", filters, "-ac", "1", "-c:a", "libmp3lame", "-q:a", "5", out]);
}

if (args.includes("--samples")) {
  mkdirSync("art/source/voice-samples", { recursive: true });
  const sample = { turkey: LINES["turkey-made-0-0"].text, farmer: LINES["farmer-caught"].text };
  for (const [who, voices] of Object.entries(SAMPLE_VOICES)) {
    for (const voice of voices) {
      const out = `art/source/voice-samples/${who}-${voice.replace(".wav", "")}.mp3`;
      await record(sample[who], { ...WHO[who], voice }, out);
      console.log(out);
    }
  }
} else {
  let made = 0;
  for (const [id, { who, text }] of Object.entries(LINES)) {
    const out = `voices/${id}.mp3`;
    if (only ? !only.includes(id) : !force && existsSync(out)) continue;
    await record(text, WHO[who], out);
    made++;
    console.log(`${id}  ${text}`);
  }
  console.log(`Recorded ${made} clips.`);
}
execFileSync("rm", ["-f", tmp]);
