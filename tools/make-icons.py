# Makes the app icons: the turkey running for his life, sweating, on farm-grass green. Gene picked it
# (B) from a choice page on 2026-10-29. The picture is art/source/gen/icon-run-2.png, cut out with
# tools/cutout.py --height 600 and tools/noshadow.py --from 0.75 (prompt in tools/art-prompts.py).
# Run from the project folder:  python3 tools/make-icons.py [cut-out .png]
import sys

from PIL import Image

BACKGROUND = (122, 168, 64, 255)  # farm grass

turkey = Image.open(sys.argv[1] if len(sys.argv) > 1 else "art/source/icons/icon-turkey.png").convert("RGBA")
turkey = turkey.crop(turkey.getbbox())


def icon(size, margin, background=BACKGROUND):
    img = Image.new("RGBA", (size, size), background)
    fit = (size - 2 * margin) / max(turkey.size)
    t = turkey.resize((round(turkey.width * fit), round(turkey.height * fit)), Image.LANCZOS)
    img.alpha_composite(t, ((size - t.width) // 2, (size - t.height) // 2))
    return img


if __name__ == "__main__":
    icon(512, 36).save("icons/icon-512.png")
    icon(192, 14).save("icons/icon-192.png")
    icon(512, 100).save("icons/icon-maskable-512.png")  # Android crops these to a circle
    print("icons written")
