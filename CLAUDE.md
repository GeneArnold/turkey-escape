# Turkey Escape

A new Fun Shed game for Thanksgiving 2026, started 2026-10-28. This file is the brief, written by the
Fruitcake session. Replace it with the game's own notes as the game takes shape.

## Where it stands (2026-10-28)

Gene chose a **chase runner** (three lanes, swipes, a farmer chasing), in the spirit of the
endless-runner genre he pointed at, but our own turkey game, not a copy of any one game.
A first playable with stand-in art drawn in code is built; see README.md. Next: Gene tries it on
his phone, then the art. **New farmer and new farm**: nothing from Feed the Chickens (Uncle Bob's
game is his alone). Release: probably the Nov 23 slot, but Gene says not to worry about dates.
Online scores are off (`scoresUrl: null`) until the funshed session adds the app to the Shed.

Art (2026-10-28): the first cartoon art is in. The prompts are in `tools/art-prompts.py` and the
picks are listed in BootScene `SPRITES`. Gene liked the turkeys. Our own turkey (Gene doesn't mind
either way about sharing Turkey Bowling's): `turkey` is a rear view from `turkey-back-3`, and
`turkey-scared` looks back over its shoulder (`turkey-look-1`). The farmer is cut from
`farmer-sheet-3`. The skies are cropped at the horizon (`img/sky-<day>.jpg`). z-image ignored
"seen from behind" on a character sheet but drew rear views when asked one at a time. Ducking and
jumping squash and stretch the one rear view. `tools/noshadow.py` clears grey shadows;
`js/textures.js` `sized()` fits a picture to its stand-in's size.

## The first brief (superseded where the above differs)

It's the week before Thanksgiving. The turkey has worked out what the farmer is planning and makes
a run for it.

- Controls: one thumb. It's a runner: swipe up to jump (fences, hay bales, puddles), swipe down to
  duck or slide (low branches, a lasso), and swipe sideways to change lanes if it has lanes.
- Levels are days. Monday to Wednesday run through the farm, the cornfield and the town. Each day
  is a little faster, with more in the way.
- Thanksgiving Day is the boss: the farmer chases with a roasting pan. Survive to the end and the
  turkey is "pardoned". It could finish at a family table eating pizza instead.
- Pick-ups: corn kernels for points, and a pumpkin for a shield or one free hit.
- Tone: silly and cartoony, like the other games. The turkey always gets away, and nothing gory.
- A score per day, plus the farthest distance on the final day.

Gene hasn't approved any of this beyond "Turkey Escape", so ask him before building on it.
Feed the Chickens (`~/Workspace/feed-the-chickens`) already has cartoon farm backgrounds, a farmer
(Uncle Bob) and a sprite style that fit. Ask Gene whether Turkey Escape should share that world.

## Deadlines

Gene is giving away one game a week from the start of November until New Year. Thanksgiving is
Nov 26, 2026. There are two turkey games, Turkey Bowling and Turkey Escape (in
`~/Workspace/turkey-bowling` and `~/Workspace/turkey-escape`). One fits the Monday Nov 23 slot, and
the other the week before or after; Gene decides which. The release calendar is kept in
`~/Workspace/thefunshed/CLAUDE.md`. Keep the first playable version small and get it onto Gene's
phone early: he reacts to what he sees.

## How Fun Shed games are built

Copy from these working games:
- `~/Workspace/family-holiday-game`: Fruitcake Flingers. The reference for the house setup
  (update button, pause, install hint, scores).
- `~/Workspace/feed-the-chickens`: Feed the Chickens. It's the closest to this one: a farm, a
  character moving through sceneries that get harder, and cartoon sprites.
- `~/Workspace/xmas-light-madness`: Lights Out!

Read their READMEs first. The basics:

- Plain HTML and JavaScript with Phaser 3.90 saved in `vendor/`. No build step.
- An installable PWA that plays offline: `sw.js` and `manifest.webmanifest`. Phone first, portrait.
- The title screen has:
  - the version shown at the bottom;
  - a check for a newer release, with an orange "NEW VERSION! TAP TO UPDATE" button;
  - an install hint.
  See `js/update.js`, `js/version.js` and `js/install.js` in Fruitcake.
- `amplify.yml` stamps the release into these files.
- A pause button during play, with KEEP PLAYING and QUIT. The game also pauses when it's hidden.
  Watch out: Phaser keeps `time.paused` and paused tweens when a scene restarts.
- Don't add a "quit the app" button on the title screen. Android won't let a web app close itself.
- Players: three swiped arcade initials. Each phone keeps its own top 10.
- Online boards go through the shared Shed service at `https://api.thefunshed.com/v1/<app>`. Ask
  the thefunshed session to add the app.
- Trash talk: share a score with a `?beat=` dare link.
- Art: cartoon pictures made on cerebro's SwarmUI with `tools/swarm.py` and cut out with
  `tools/cutout.py`.
  - Fruitcake's `tools/art-prompts.py` and `tools/contact.py` hold the prompt recipes and make contact
    sheets.
  - Draw several poses of a character on one "character sheet" so they match.
  - Backgrounds: scenery in the top third, an empty bottom for play.
  - Show Gene the choices on a contact sheet before wiring them in.
- Voices, if any: Chatterbox on cerebro (`tools/make-voices.mjs`). Ask before restarting cerebro or
  its services.
- Test on the phone with `python3 tools/serve.py`, which turns caching off.

## Gene's rules

- AWS only (Amplify, Route 53). No Cloudflare, Vercel, Netlify or GCP.
- Commit and push only when Gene asks; a push to `main` is a release.
- Free with no ads. At most one quiet tip-jar link. Open source (MIT); keep `art/source/` gitignored.
- No real people's photos and no family faces.
- **Simple and amusing, not amazing**: "these are just fun free games." Cut anything that confuses or
  barely matters, rather than explaining it.
- Design rule: "is it easy to do? Is it simple? Or if it's hard, will it help make things better
  later on?"

## Going live

When it's ready to go live:
1. Make a GitHub repo, GeneArnold/turkey-bowling. It can be public.
2. Gene creates an Amplify app in the Entertainment AWS account (Ohio), with Gen2 Backend unticked.
3. The thefunshed session attaches `turkey.thefunshed.com` and adds the game to the home page.
