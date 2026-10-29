# The prompts behind the cartoon art, so any picture can be made again. Each line runs tools/swarm.py.
#   python3 tools/art-prompts.py turkey       the turkey's character sheet, seen from behind
#   python3 tools/art-prompts.py farmer       the farmer's character sheet
#   python3 tools/art-prompts.py things [fence hay ...]   obstacles, pick-ups and roadside props, one each
#   python3 tools/art-prompts.py sky [farm corn ...]      the far scenery above the horizon, for each day
#   add --n 4 for more tries of each (default 3)
# Tries land in art/source/gen/; tools/cutout.py turns the picks into img/ sprites.
import subprocess
import sys

N = sys.argv[sys.argv.index("--n") + 1] if "--n" in sys.argv else "3"

TURKEY = ("character sheet of the same plump cartoon Thanksgiving turkey, brown feathers, a big round fan "
          "of red orange and golden tail feathers, skinny orange legs, little red wattle. All four drawn "
          "seen from directly behind, back of the head, the tail fan facing the viewer, face not visible. "
          "Four turkeys side by side in a row, evenly spaced, not overlapping, the same size: "
          "1 running away, one leg up mid-stride, 2 jumping high in the air with both wings flapping and legs "
          "tucked up, 3 ducking down low, squashed flat with its head pulled in, 4 running away flapping its "
          "wings in a panic")

FARMER = ("character sheet of the same big goofy cartoon farmer man, chubby, a wide straw hat, a huge bushy "
          "brown moustache, a red and black plaid flannel shirt with rolled up sleeves, blue denim overalls, "
          "brown work boots, holding a big shiny silver roasting pan with a lid. Four poses side by side, "
          "evenly spaced, not overlapping, the same size: 1 seen from the front running toward the viewer "
          "holding the roasting pan high over his head, grinning, 2 seen from the front shouting with an "
          "angry face shaking his fist, 3 seen from directly behind running away from the viewer holding the "
          "roasting pan over his head, 4 seen from directly behind diving forward with both arms out")

ONE = ", front view, facing the viewer, simple and clean, no shadow, no ground"
# for things to duck under: they hang high, with room for the turkey underneath
HIGH = ", strung high up between two tall thin wooden poles, lots of empty space underneath" + ONE
THINGS = {
    # jump over
    "fence": "a single short section of a wooden farm fence, three white rails between two posts" + ONE,
    "hay": "a single rectangular hay bale tied with two strings" + ONE,
    "puddle": "a single wide shallow brown mud puddle seen from slightly above, flat on the ground, no shadow",
    "crate": "a single wooden crate full of orange pumpkins" + ONE,
    # duck under
    "line": "a washing line strung between two wooden posts with socks, long underwear and a shirt hanging from it" + ONE,
    "branch": "a single long thick crooked tree branch lying sideways, with a few orange autumn leaves, no trunk" + ONE,
    "banner": "a wide cloth banner hanging between two poles that says nothing, orange and brown stripes with leaves on it, blank" + ONE,
    # swerve around
    "tractor": "a single little old red farm tractor, big back wheels, round headlights" + ONE,
    "wagon": "a single wooden hay wagon piled high with hay, seen from the back end" + ONE,
    "truck": "a single little old blue pickup truck with round headlights and a chrome grille" + ONE,
    # pick-ups
    "corn": "a single ear of yellow corn with the green husk peeled back" + ONE,
    "pumpkin": "a single round orange pumpkin with a short green stem, smiling jack o lantern face" + ONE,
    "lid": "a single big shiny silver roasting pan lid, domed, with a handle on top, side view, no shadow",
    # by the road
    "tree": "a single round autumn tree with orange and red leaves" + ONE,
    "scarecrow": "a single goofy scarecrow on a pole with a straw hat and a patched shirt" + ONE,
    "cornstalk": "a single tall dry golden corn stalk with leaves and one ear of corn" + ONE,
    "house": "a single small cozy wooden house with a porch and a pumpkin on the steps" + ONE,
    "lamp": "a single old fashioned black street lamp" + ONE,
    # the days added on 2026-10-29: pumpkin patch, orchard, fair, market, parking lot, parade, first snow
    "pumpkins": "a single low pile of five round orange pumpkins" + ONE,
    "wheelbarrow": "a single old red wheelbarrow full of orange pumpkins, seen from the front" + ONE,
    "basket": "a single big wooden bushel basket overflowing with red apples" + ONE,
    "ladder": "a single long wooden orchard ladder lying sideways, horizontal, rungs pointing up and down" + HIGH,
    "applecart": "a single wooden farm cart piled high with red apples, big wooden wheels, seen from the back end" + ONE,
    "appletree": "a single round apple tree with green leaves and lots of red apples" + ONE,
    "pigpen": "a single short low wooden pig pen fence with a muddy pink pig peeking over it" + ONE,
    "bunting": "a string of colorful triangle party flags" + HIGH,
    "candy": "a single little striped cotton candy stand on wheels with pink and blue cotton candy, seen from the front" + ONE,
    "tent": "a single red and white striped county fair tent with a little flag on top" + ONE,
    "squash": "a single wooden crate full of green and orange squash and gourds" + ONE,
    "awning": "a red and white striped cloth awning" + HIGH,
    "piecart": "a single little wooden market cart with a striped umbrella, full of pies, seen from the front" + ONE,
    "stall": "a single little wooden farmers market stall with a striped awning and baskets of vegetables" + ONE,
    "cone": "a single orange and white traffic cone" + ONE,
    "cart": "a single empty silver grocery shopping cart, seen from the front" + ONE,
    "car": "a single little round cartoon family car, seen from the back, red, small and cute" + ONE,
    "sign": "a single big hanging red and yellow store sign with no writing on it, blank" + HIGH,
    "drum": "a single big marching band bass drum lying on its side, red and gold" + ONE,
    "float": "a single parade float shaped like a giant cornucopia full of fruit, on a flatbed, seen from the back" + ONE,
    "streamers": "a long garland of orange yellow and brown paper streamers and leaves" + HIGH,
    "balloon": "a single big round orange parade balloon shaped like a smiling pumpkin, floating, with ropes hanging down" + ONE,
    "snowman": "a single round friendly snowman with a carrot nose, a scarf and a top hat" + ONE,
    "sled": "a single old wooden sled with red runners" + ONE,
    "ice": "a single wide flat patch of shiny pale blue ice seen from slightly above, flat on the ground, no shadow",
    "icebranch": "a long snowy tree branch with icicles hanging from it" + HIGH,
    "pine": "a single snowy green pine tree" + ONE,
    # the app icon (tools/make-icons.py)
    "icon-run": "a single plump cartoon Thanksgiving turkey running for his life straight toward the viewer, panicked "
                "terrified face with huge wide eyes and open beak, big sweat drops flying off his head, legs pumping "
                "mid-stride, wings flapping, a big round fan of red orange and golden tail feathers behind him, little "
                "red wattle, front view, simple and clean, no shadow, no ground, plain white background",
}

BG = (", 2D cartoon game background art, bold clean black outlines, flat bright colors, simple cel "
      "shading, Saturday-morning cartoon style, no characters, no people, no animals, no text")
FLAT = ". The horizon is in the middle of the picture; the bottom half is plain flat empty {} with nothing on it"
SKIES = {
    "farm": "wide panoramic landscape of a cartoon farm far away on a sunny autumn morning, a red barn, a "
            "silo and a farmhouse on rolling green hills, autumn trees, blue sky with puffy white clouds"
            + FLAT.format("green grass"),
    "corn": "wide panoramic landscape of endless golden cornfields far away on an autumn afternoon, rolling "
            "hills, a little windmill, a few orange trees, a pale blue and yellow sky"
            + FLAT.format("golden stubble field"),
    "town": "wide panoramic landscape of a small cartoon country town far away, a main street with little "
            "brick shops, a white church steeple, a water tower, autumn trees, late afternoon sky"
            + FLAT.format("green grass"),
    "patch": "wide panoramic landscape of a cartoon pumpkin patch far away, rows of orange pumpkins, a red barn, a hay "
             "maze, autumn trees, a bright blue sky"
             + FLAT.format("green and brown grass"),
    "orchard": "wide panoramic landscape of a cartoon apple orchard far away, neat rows of round apple trees with red "
               "apples, a little red farm stand, rolling green hills, a soft blue sky"
               + FLAT.format("green grass"),
    "fair": "wide panoramic landscape of a cartoon county fair far away, a big ferris wheel, striped tents, colorful "
            "flags, a red barn, an early evening pink and orange sky"
            + FLAT.format("trampled green grass"),
    "market": "wide panoramic landscape of a cartoon small town farmers market far away, rows of little stalls with "
              "striped awnings, a brick clock tower, autumn trees, a sunny morning sky"
              + FLAT.format("grey cobblestone"),
    "lot": "wide panoramic landscape of a big cartoon grocery store far away with a big empty blank sign, rows of "
           "parked cars, tall parking lot lamps, a cloudy afternoon sky"
           + FLAT.format("grey asphalt"),
    "parade": "wide panoramic landscape of a cartoon city street parade far away, giant floating balloons shaped like "
              "a turkey and a pumpkin, tall buildings, crowds of tiny dots, confetti, a bright blue sky"
              + FLAT.format("grey street"),
    "snow": "wide panoramic landscape of a snowy countryside far away at dusk, the first snow, snowy pine trees, a "
            "farmhouse with warm lit windows, snowflakes falling, a deep blue and purple evening sky"
            + FLAT.format("white snow"),
    "feast": "wide panoramic landscape of the countryside at a glowing orange Thanksgiving sunset, a cozy "
             "farmhouse with warm lit windows far away, autumn trees, orange and pink sky, a few dark clouds"
             + FLAT.format("brown autumn grass"),
}


def swarm(name, prompt, w, h, raw=False):
    cmd = ["python3", "tools/swarm.py", name, prompt, "--n", N, "--w", str(w), "--h", str(h)]
    subprocess.run(cmd + (["--raw"] if raw else []), check=True)


def main():
    what = sys.argv[1]
    pick = [a for a in sys.argv[2:] if not a.startswith("--") and a != N]
    if what == "turkey":
        swarm("turkey-sheet", TURKEY, 2048, 768)
    elif what == "farmer":
        swarm("farmer-sheet", FARMER, 2048, 768)
    elif what == "things":
        for kind, prompt in THINGS.items():
            if not pick or kind in pick:
                swarm(kind, prompt, 1024, 1024)
    elif what == "sky":
        for day, prompt in SKIES.items():
            if not pick or day in pick:
                swarm("sky-" + day, prompt + BG, 1344, 768, raw=True)


main()
