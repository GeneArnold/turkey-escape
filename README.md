# Turkey Escape

It's the week before Thanksgiving, and the turkey has worked out what the farmer is planning. Run!
Swipe up to jump, down to duck, left and right to change lanes. Grab the corn, and don't let the
farmer catch you. Make it through Monday, Tuesday and Wednesday, survive Thanksgiving Day, and the
turkey is pardoned.

A Fun Shed game: plain HTML and JavaScript with [Phaser 3.90](https://phaser.io) saved in
`vendor/`. There is no build step, it installs on phones as an app, and it plays offline. Built the
same way as Fruitcake Flingers (`../family-holiday-game`).

## Run it on a computer

```
python3 tools/serve.py
```

Open http://127.0.0.1:8797 (or `http://<this computer's address>:8797` on a phone on the home
network). Arrow keys work as swipes. `?day=4` starts on Thanksgiving, for trying the later days.
On localhost and plain http the offline cache is switched off, so edits show up on a plain reload.

## How it plays

- Three lanes, seen from behind the turkey. Things come at you out of the distance:
  - **jump** over fences, hay bales, puddles and crates (swipe up; swipe up in the air to jump
    again as soon as you land);
  - **duck** under washing lines, branches and banners (swipe down; down in the air drops you);
  - **swipe around** tractors, hay wagons and trucks.
- Clip a jump or duck thing and you **stumble**: the farmer catches up (he comes up the bottom of
  the screen with his roasting pan). Stumble again while he's close, or run into a tractor, and
  he's got you: CAUGHT.
- **Corn** is 10 points; every step is a point; each day you make it through is 500, and the pardon
  2,500. A **pumpkin** takes one hit for you.
- **Days:** Monday on the farm, Tuesday in the cornfield, Wednesday in town, each faster and
  busier. **Thanksgiving** is the finale: the farmer never lets up, so one slip and he's got you.
- The first two runs on a phone start with a short lesson on Monday.
- The pause button (top middle) stops the run, with KEEP PLAYING or QUIT. Switching apps, or the
  phone's back gesture, pauses too.

All the numbers are in `js/rules.js`. `node tools/test-run.mjs` runs a robot through every day to
check each can be got through.

## Files

| File | What it does |
|---|---|
| `js/rules.js` | The days: speed, length, what's in the way, the colours; the points |
| `js/scenes/PlayScene.js` | The run: the road, the turkey, the farmer, what's in the way, the corn |
| `js/scenes/` | Also Boot, Name (initials), Title, Day (the card before each day), Pause, Results, Board |
| `js/textures.js` | The stand-in art drawn in code. A picture in `img/` with the same name replaces one |
| `js/audio.js` | Placeholder sound effects |
| `js/storage.js` | What the phone remembers: initials, its top 10, totals, unsent runs |
| `js/share.js` | Trash talk: the share sheet (or a text message), the score picture, dare links (`?beat=GEN-4250`) |
| `js/update.js`, `js/version.js` | The version on the title screen, the check for a newer release, the update button |
| `js/install.js` | The title screen's "install me" hint |
| `sw.js`, `manifest.webmanifest` | Offline play and installing as an app. New pictures go in `FILES` in `sw.js` |
| `amplify.yml` | How Amplify publishes a push |
| `tools/` | Serves the game for testing, the robot test, the art tools (`swarm.py`, `cutout.py`, `contact.py`, `make-icons.py`) |

## Releasing

Same as Fruitcake: a GitHub repo, an Amplify app in the Entertainment AWS account, and every push
to `main` is a release, at https://turkey.thefunshed.com. Not set up yet.
