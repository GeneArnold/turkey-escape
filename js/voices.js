// The spoken lines: the turkey (squeaky) and the farmer (gruff). tools/make-voices.mjs records each
// one with Chatterbox on cerebro into voices/<id>.mp3. The words on screen are written separately,
// in capitals; these are how they're said.
export const LINES = {
  // the farmer, on the day card
  "farmer-day-0": { who: "farmer", text: "Come back here, you bird!" },
  "farmer-day-1": { who: "farmer", text: "You can't hide in my corn!" },
  "farmer-day-2": { who: "farmer", text: "Somebody stop that turkey!" },
  "farmer-day-3": { who: "farmer", text: "The oven's hot! Get over here!" },
  // the farmer, when the turkey stumbles and he catches up
  "farmer-close-0": { who: "farmer", text: "Ha! I'm gaining on ya!" },
  "farmer-close-1": { who: "farmer", text: "Gravy's waiting, buddy!" },
  "farmer-close-2": { who: "farmer", text: "Almost got ya!" },
  // the farmer, when he catches the turkey
  "farmer-caught": { who: "farmer", text: "Gotcha! Dinner is served!" },
  // the turkey, picking up a power-up
  "turkey-pumpkin": { who: "turkey", text: "Pumpkin shield!" },
  "turkey-sneakers": { who: "turkey", text: "Turbo sneakers!" },
  "turkey-magnet": { who: "turkey", text: "Corn magnet!" },
  // the turkey at the end of each day: MADE_IT in PlayScene, day by day, line by line
  "turkey-made-0-0": { who: "turkey", text: "Wow, I'm not getting cooked!" },
  "turkey-made-0-1": { who: "turkey", text: "Phew! Not cooked yet!" },
  "turkey-made-0-2": { who: "turkey", text: "That was too close!" },
  "turkey-made-1-0": { who: "turkey", text: "Still not stuffing!" },
  "turkey-made-1-1": { who: "turkey", text: "No gravy for me!" },
  "turkey-made-1-2": { who: "turkey", text: "Gobble gobble, sucker!" },
  "turkey-made-2-0": { who: "turkey", text: "Thanksgiving is tomorrow?!" },
  "turkey-made-2-1": { who: "turkey", text: "I'm sweating gravy here!" },
  "turkey-made-2-2": { who: "turkey", text: "Too hot. Oven hot." },
  "turkey-made-3-0": { who: "turkey", text: "No oven for me. Pizza tonight!" },
};

export const voiceUrl = (id) => (LINES[id] ? `voices/${id}.mp3` : null);
