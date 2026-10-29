// The service worker: on the first visit it stores every file of the game on the phone, and from
// then on it answers from that copy, so the game starts with no internet at all.
// VERSION must change whenever any file changes; the next online visit then fetches the new copy.
// Amplify does that on every release (amplify.yml stamps in the commit); "dev" is for local runs.
// Every file the game needs must be in FILES, new pictures in img/ too, or it won't work offline.
const VERSION = "turkey-dev";
const FILES = [
  "./",
  "index.html",
  "style.css",
  "manifest.webmanifest",
  "vendor/phaser.min.js",
  "js/audio.js",
  "js/config.js",
  "js/gestures.js",
  "js/install.js",
  "js/main.js",
  "js/rules.js",
  "js/share.js",
  "js/storage.js",
  "js/textures.js",
  "js/ui.js",
  "js/update.js",
  "js/version.js",
  "js/scenes/BoardScene.js",
  "js/scenes/BootScene.js",
  "js/scenes/DayScene.js",
  "js/scenes/NameScene.js",
  "js/scenes/PauseScene.js",
  "js/scenes/PlayScene.js",
  "js/scenes/ResultsScene.js",
  "js/scenes/TitleScene.js",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  // the cartoon art (img/): add each new picture here
  "img/banner.png", "img/corn.png", "img/crate.png", "img/farmer-empty.png", "img/farmer-front.png", "img/farmer.png",
  "img/fence.png", "img/hay.png", "img/house.png", "img/lamp.png", "img/lid.png", "img/magnet.png", "img/sneaker.png", "img/sneakers.png", "img/line.png",
  "img/puddle.png", "img/pumpkin.png", "img/scarecrow.png", "img/sky-corn.jpg", "img/sky-farm.jpg",
  "img/sky-feast.jpg", "img/sky-town.jpg", "img/tractor.png", "img/tree.png", "img/truck.png",
  "img/turkey.png", "img/turkey-scared.png", "img/turkey-phew.png", "img/turkey-yay.png", "img/turkey-cool.png", "img/wagon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(VERSION);
      await cache.addAll(FILES);
    })(),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Cache first: the stored copy answers at once, online or not.
self.addEventListener("fetch", (event) => {
  // Only the game's own files; the family score service must always be asked fresh.
  // version.json, which says whether a newer release is out, is never answered from the stored copy.
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== location.origin || url.pathname.endsWith("/version.json")) return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((hit) => hit || fetch(event.request)),
  );
});
