// Loads any finished cartoon pictures, draws the stand-ins for the rest, then opens the game.
import * as store from "../storage.js";
import { DAYS } from "../rules.js";
import { readChallenge } from "../share.js";
import { makeTextures } from "../textures.js";
import { H, W, setupCamera, text } from "../ui.js";

// The cartoon pictures in img/ (made with tools/swarm.py and tools/cutout.py), by texture key.
// Until a picture is made, the drawing in js/textures.js stands in for it.
export const SPRITES = [
  "turkey", "turkey-scared", "turkey-phew", "turkey-yay", "turkey-cool", "farmer", "farmer-front", "farmer-empty", "lid",
  "fence", "hay", "puddle", "crate", "line", "banner", "tractor", "wagon", "truck",
  "corn", "pumpkin", "sneakers", "sneaker", "magnet", "tree", "scarecrow", "house", "lamp",
];
// The far scenery for each day, img/sky-<day>.jpg (see drawSky in PlayScene).
const SKIES = DAYS.map((d) => "sky-" + d.id);

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    setupCamera(this);
    const status = text(this, W / 2, H / 2, "Gobble gobble...", 28);
    for (const key of SPRITES) this.load.image(key, `img/${key}.png`);
    for (const key of SKIES) this.load.image(key, `img/${key}.jpg`);
    this.load.on("progress", (v) => status.setText(`Gobble gobble... ${Math.round(v * 100)}%`));
    this.load.on("loaderror", (file) => console.warn("Could not load", file.src));
  }

  create() {
    makeTextures(this);
    readChallenge();
    this.scene.start(store.get("player") ? "Title" : "Name");
  }
}
