"""Builds the lesson covers from Cassidy's Coco expression sheet (Sheet A).

Usage:  python scripts/make-covers.py "<path to Atlantean Gardens_ Cosmic Brown Expressions.png>" public
Writes public/thumbnails/lesson-0N.jpg (960x540), public/posters/lesson-0N.jpg (720x1280)
and public/coco-mascot.png (the round Chill Vibes Coco in the top bar).
Change LESSONS below to give a lesson a different expression. Needs Pillow.
"""
import math, random, sys
from PIL import Image, ImageDraw, ImageFilter

SRC, OUT = sys.argv[1], sys.argv[2]
sheet = Image.open(SRC).convert('RGB')

ROWS = [(24, 250), (330, 554), (654, 880)]
COLS = [300, 624, 948]
PANELS = {  # name: (row, col)
    'zen': (0, 0), 'happy': (0, 1), 'focused': (0, 2),
    'sleepy': (1, 0), 'megamind': (1, 1), 'chill': (1, 2),
    'powered': (2, 0), 'lovestruck': (2, 1), 'wise': (2, 2),
}
LESSONS = {1: 'happy', 2: 'zen', 3: 'chill', 4: 'powered', 5: 'lovestruck', 6: 'focused', 7: 'megamind'}
GROUNDS = ['#eadcc6', '#e6d6c0', '#e3dccb', '#ead6c4', '#e2d9c4', '#e8d3bd', '#dfd8c6']
INKS = [(169, 74, 42), (196, 146, 74), (111, 122, 92), (42, 34, 27)]

def panel(name):
    r, c = PANELS[name]
    y0, y1 = ROWS[r]; x0 = COLS[c]
    inset = 4
    return sheet.crop((x0 + inset, y0 + inset, x0 + 296 - inset, y1 - inset))

def hexrgb(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))

def flow_lines(w, h, seed, ss=3, center=0.5, alpha_k=1.0):
    """Soft drifting lines like the site's hero, drawn large then shrunk for smooth edges."""
    rnd = random.Random(seed)
    layer = Image.new('RGBA', (w * ss, h * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i in range(7):
        y = h * (center + (i - 3) * 0.035)
        a1, f1, p1 = min(h, w * 1.2) * (0.06 + rnd.random() * 0.06), 1 + rnd.randrange(2), rnd.random() * 6
        a2, f2, p2 = min(h, w * 1.2) * (0.015 + rnd.random() * 0.02), 3 + rnd.randrange(3), rnd.random() * 6
        pts = []
        for s in range(0, 241):
            x = w * s / 240
            yy = y + a1 * math.sin(x / w * f1 * 2 * math.pi + p1) + a2 * math.sin(x / w * f2 * 2 * math.pi + p2)
            pts.append((x * ss, yy * ss))
        col = INKS[(i + seed) % len(INKS)]
        if alpha_k != 1.0 and col == INKS[3]: col = (241, 232, 216)
        alpha = int(255 * (0.35 + rnd.random() * 0.4) * alpha_k)
        d.line(pts, fill=col + (alpha,), width=max(1, int((1 + rnd.random() * 2.2) * ss)), joint='curve')
    return layer.resize((w, h), Image.LANCZOS)

def rounded_mask(size, radius, ss=4):
    w, h = size
    m = Image.new('L', (w * ss, h * ss), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, w * ss - 1, h * ss - 1), radius * ss, fill=255)
    return m.resize(size, Image.LANCZOS)

def cover(n, w, h, art_h_frac, ground_hex=None, art_cy=0.5, lines_cy=0.5, alpha_k=1.0):
    ground = Image.new('RGB', (w, h), hexrgb(ground_hex or GROUNDS[n - 1]))
    lines = flow_lines(w, h, n, center=lines_cy, alpha_k=alpha_k)
    ground.paste(lines, (0, 0), lines)
    art = panel(LESSONS[n])
    ah = int(h * art_h_frac)
    aw = int(ah * art.width / art.height)
    if aw > w * 0.84:
        aw = int(w * 0.84); ah = int(aw * art.height / art.width)
    art = art.resize((aw, ah), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    x, y = (w - aw) // 2, int(h * art_cy - ah / 2)
    radius = max(10, aw // 22)
    # soft shadow
    shadow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    sm = rounded_mask((aw, ah), radius)
    sh = Image.new('RGBA', (aw, ah), (42, 34, 27, 110)); sh.putalpha(sm.point(lambda v: v * 110 // 255))
    shadow.paste(sh, (x, y + max(6, ah // 30)), sh)
    shadow = shadow.filter(ImageFilter.GaussianBlur(max(8, ah // 22)))
    ground.paste(shadow, (0, 0), shadow)
    # hairline frame a few px outside the art
    pad = max(6, aw // 45)
    fr = Image.new('RGBA', (w * 4, h * 4), (0, 0, 0, 0))
    ImageDraw.Draw(fr).rounded_rectangle(((x - pad) * 4, (y - pad) * 4, (x + aw + pad) * 4, (y + ah + pad) * 4),
                                         (radius + pad) * 4, outline=(169, 74, 42, 150), width=5)
    fr = fr.resize((w, h), Image.LANCZOS)
    ground.paste(fr, (0, 0), fr)
    ground.paste(art, (x, y), rounded_mask((aw, ah), radius))
    return ground

def mascot(size=160, ss=4):
    """Round 'Chill Vibes' Coco for the top bar, transparent outside the circle."""
    art = panel('chill')
    cx, cy, half = 146, 106, 100  # his face, beanie to chin, within the panel
    face = art.crop((cx - half, cy - half, cx + half, cy + half)).resize((size, size), Image.LANCZOS)
    m = Image.new('L', (size * ss, size * ss), 0)
    ImageDraw.Draw(m).ellipse((0, 0, size * ss - 1, size * ss - 1), fill=255)
    out = face.convert('RGBA'); out.putalpha(m.resize((size, size), Image.LANCZOS))
    return out

mascot().save(f'{OUT}/coco-mascot.png', optimize=True)

for n in LESSONS:
    cover(n, 960, 540, 0.66).save(f'{OUT}/thumbnails/lesson-0{n}.jpg', quality=86, optimize=True, progressive=True)
    cover(n, 720, 1280, 0.36, ground_hex='#1d1814', art_cy=0.29, lines_cy=0.74, alpha_k=0.8).save(f'{OUT}/posters/lesson-0{n}.jpg', quality=86, optimize=True, progressive=True)
print('done')
