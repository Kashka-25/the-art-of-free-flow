"""Removes a transparency checkerboard that an image generator drew into the picture.

Usage: python scripts/cutout-checkerboard.py in.webp out.png preview.png [x0,y0,x1,y1 ...]
The optional boxes mark glow painted over the checkerboard (e.g. music notes); inside them only
solid colour is kept. Needs Pillow and numpy. Used for rockstar Coco (public/coco-rockstar*.webp).
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

src, out, preview = sys.argv[1:4]
# Optional boxes 'x0,y0,x1,y1' where pale glow over checker is dropped, keeping only solid colour.
GLOW_BOXES = [tuple(map(int, b.split(','))) for b in sys.argv[4:]]
im = Image.open(src).convert('RGB')
a = np.asarray(im).astype(np.int16)
mx, mn = a.max(axis=2), a.min(axis=2)
bglike = (mx - mn < 16) & (mn > 196)

def dilate(m):
    d = m.copy()
    d[1:] |= m[:-1]; d[:-1] |= m[1:]; d[:, 1:] |= m[:, :-1]; d[:, :-1] |= m[:, 1:]
    return d

seed = np.zeros_like(bglike)
seed[0, :] = bglike[0, :]; seed[-1, :] = bglike[-1, :]; seed[:, 0] = bglike[:, 0]; seed[:, -1] = bglike[:, -1]
while True:
    nxt = dilate(seed) & bglike
    if nxt.sum() == seed.sum():
        break
    seed = nxt
bg = seed

def erode(m):
    e = m.copy()
    e[1:] &= m[:-1]; e[:-1] &= m[1:]; e[:, 1:] &= m[:, :-1]; e[:, :-1] &= m[1:] if False else m[:, 1:]
    return e

def reconstruct(marker, mask):
    while True:
        nxt = dilate(marker) & mask
        if nxt.sum() == marker.sum():
            return nxt
        marker = nxt

# Enclosed pockets (inside the bolts, between swirls): strictly neutral areas big enough
# to survive a 5px erosion. Thin highlights and tinted cloud whites don't qualify.
neutral = (mx - mn < 8) & (mn > 196)
core = neutral
for _ in range(5):
    core = erode(core)
bg = bg | reconstruct(core, neutral)
# Soak up the thin light-grey fringe left by anti-aliasing: one ring of near-neutral, light pixels.
fringe = dilate(bg) & ~bg & (mx - mn < 40) & (mn > 150)
bg = bg | fringe
# Glow painted over the checkerboard (pale yellow squares) and grey edge dots: pale pixels
# that are not bluish (cloud whites are), grown out from the background a limited distance.
r, g, b = a[..., 0], a[..., 1], a[..., 2]
pale = (mn > 168) & (mx - mn < 110) & (b <= g + 4)
grown = bg.copy()
for _ in range(28):
    grown = (dilate(grown) & pale) | grown
bg = grown

# Glow-tinted checker trapped inside swirls: pale, non-bluish pockets close to the
# background and much smaller than the sun's bright centre.
from collections import deque
cand = (mn > 190) & (mx - mn < 48) & (b <= g + 4) & ~bg
near = bg.copy()
for _ in range(40):
    near = dilate(near)
H, W = cand.shape
seen = np.zeros_like(cand)
ys, xs = np.nonzero(cand & near)
for y0, x0 in zip(ys, xs):
    if seen[y0, x0]:
        continue
    comp = []; q = deque([(y0, x0)]); seen[y0, x0] = True
    while q:
        y, x = q.popleft(); comp.append((y, x))
        if len(comp) > 9000:
            break
        for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= yy < H and 0 <= xx < W and cand[yy, xx] and not seen[yy, xx]:
                seen[yy, xx] = True; q.append((yy, xx))
    if len(comp) <= 9000:
        cy, cx = zip(*comp)
        bg[list(cy), list(cx)] = True

for x0, y0, x1, y1 in GLOW_BOXES:
    sub = (mn > 150) & (mx - mn < 125) & (b <= g + 4)
    region = np.zeros_like(bg); region[y0:y1, x0:x1] = True
    bg = bg | (sub & region)

# Drop tiny opaque specks floating in the background.
solid = ~bg
core = solid
for _ in range(3):
    core = erode(core)
solid = reconstruct(core, solid)
bg = ~solid
alpha = np.where(bg, 0, 255).astype(np.uint8)
am = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.7))
rgba = im.convert('RGBA'); rgba.putalpha(am)
bbox = am.point(lambda v: 255 if v > 8 else 0).getbbox()
rgba = rgba.crop(bbox)
rgba.save(out, optimize=True)
# Check on dark and on paper to spot leftovers.
w, h = rgba.size
pv = Image.new('RGB', (w * 2 + 20, h), (29, 24, 20))
pv.paste(Image.new('RGB', (w, h), (244, 237, 225)), (w + 20, 0))
pv.paste(rgba, (0, 0), rgba); pv.paste(rgba, (w + 20, 0), rgba)
pv.resize(((w * 2 + 20) // 2, h // 2), Image.LANCZOS).save(preview)
print('bbox', bbox, 'removed', int(bg.sum()), 'of', bg.size)
