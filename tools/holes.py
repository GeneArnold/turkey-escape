# Clears white background caught inside a cut-out, where tools/cutout.py's flood from the edges can't
# reach: the inside of a basket's handle, the gaps in a shopping cart, the window of a market stall.
# Only patches bigger than --min (a share of the picture) go, so white paint and highlights stay.
#   python3 tools/holes.py img/basket.png [--min 0.002]
import argparse

from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("png")
ap.add_argument("--min", type=float, default=0.002)
args = ap.parse_args()

im = Image.open(args.png).convert("RGBA")
px = im.load()
w, h = im.size
white = lambda x, y: px[x, y][3] > 0 and min(px[x, y][:3]) > 236
seen = set()
cleared = 0
for sy in range(h):
    for sx in range(w):
        if (sx, sy) in seen or not white(sx, sy):
            continue
        patch, todo = [], [(sx, sy)]
        seen.add((sx, sy))
        while todo:
            x, y = todo.pop()
            patch.append((x, y))
            for n in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= n[0] < w and 0 <= n[1] < h and n not in seen and white(*n):
                    seen.add(n)
                    todo.append(n)
        if len(patch) > args.min * w * h:
            for x, y in patch:
                px[x, y] = (0, 0, 0, 0)
            cleared += 1
im.save(args.png)
print(f"{args.png}: cleared {cleared} patches")
