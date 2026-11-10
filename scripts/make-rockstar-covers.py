"""Builds the lesson covers from Cassidy's rockstar Coco sticker set (one pose per lesson).

Usage:
  1. Cut the sheet out of its drawn-in checkerboard and split it into pose-1.png ... pose-7.png
     (left to right, top row first):
        python scripts/cutout-checkerboard.py "Chill Rockstar Monkey Sticker Set.png" set-cut.png preview.png
     then crop each figure from set-cut.png (they are separated by empty space).
  2. python scripts/make-rockstar-covers.py <folder with pose-N.png> public

Writes public/thumbnails/lesson-0N.jpg (960x540, warm paper) and
public/posters/lesson-0N.jpg (720x1280, dark stage, face above the play button).
Needs Pillow.
"""
import math
import random
import sys

from PIL import Image, ImageDraw, ImageFilter

POSES, OUT = sys.argv[1], sys.argv[2]
GROUNDS = ['#eadcc6', '#e6d6c0', '#e3dccb', '#ead6c4', '#e2d9c4', '#e8d3bd', '#dfd8c6']
NIGHT = '#1d1814'
INKS = [(169, 74, 42), (196, 146, 74), (111, 122, 92), (42, 34, 27)]


def hexrgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def flow_lines(w, h, seed, center, dark=False, ss=3):
    """Soft drifting lines like the site's hero, drawn large then shrunk for smooth edges."""
    rnd = random.Random(seed)
    layer = Image.new('RGBA', (w * ss, h * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    span = min(h, w * 1.2)
    for i in range(7):
        y = h * center + span * (i - 3) * 0.035
        a1, f1, p1 = span * (0.06 + rnd.random() * 0.06), 1 + rnd.randrange(2), rnd.random() * 6
        a2, f2, p2 = span * (0.015 + rnd.random() * 0.02), 3 + rnd.randrange(3), rnd.random() * 6
        pts = []
        for s in range(241):
            x = w * s / 240
            yy = y + a1 * math.sin(x / w * f1 * 2 * math.pi + p1) + a2 * math.sin(x / w * f2 * 2 * math.pi + p2)
            pts.append((x * ss, yy * ss))
        col = INKS[(i + seed) % len(INKS)]
        if dark and col == INKS[3]:
            col = (241, 232, 216)
        alpha = int(255 * (0.35 + rnd.random() * 0.4) * (0.8 if dark else 1))
        d.line(pts, fill=col + (alpha,), width=max(1, int((1 + rnd.random() * 2.2) * ss)), joint='curve')
    return layer.resize((w, h), Image.LANCZOS)


def place(ground, fig, height, cx, cy, shadow_alpha):
    """Pastes the figure centred at (cx, cy) with a soft shadow beneath."""
    w = round(fig.width * height / fig.height)
    f = fig.resize((w, height), Image.LANCZOS)
    x, y = round(cx - w / 2), round(cy - height / 2)
    sh = Image.new('RGBA', ground.size, (0, 0, 0, 0))
    blob = Image.new('L', f.size, 0)
    blob.paste(f.getchannel('A').point(lambda v: v * shadow_alpha // 255))
    sh.paste((20, 14, 10, 255), (x, y + height // 40), blob)
    sh = sh.filter(ImageFilter.GaussianBlur(height // 30))
    ground.alpha_composite(sh)
    ground.alpha_composite(f, (x, y))


for n in range(1, 8):
    fig = Image.open(f'{POSES}/pose-{n}.png').convert('RGBA')

    card = Image.new('RGBA', (960, 540), hexrgb(GROUNDS[n - 1]) + (255,))
    card.alpha_composite(flow_lines(960, 540, n, 0.62))
    place(card, fig, 500, 480, 274, 90)
    card.convert('RGB').save(f'{OUT}/thumbnails/lesson-0{n}.jpg', quality=88, optimize=True, progressive=True)

    poster = Image.new('RGBA', (720, 1280), hexrgb(NIGHT) + (255,))
    poster.alpha_composite(flow_lines(720, 1280, n, 0.8, dark=True))
    place(poster, fig, 700, 360, 400, 140)
    poster.convert('RGB').save(f'{OUT}/posters/lesson-0{n}.jpg', quality=88, optimize=True, progressive=True)

print('done')
