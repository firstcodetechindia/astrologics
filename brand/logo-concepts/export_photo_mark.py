#!/usr/bin/env python3
"""Export the approved photo mark as-is: transparent, navy, and white plates."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

SRC = Path(
    "/Users/Apple/.cursor/projects/Volumes-My-Work-Development/assets/cosmictalk-0451bdb6-b3dd-41af-8594-159f3436ed8a.png"
)
OUT = Path(__file__).resolve().parent / "from-photo"
PUBLIC = Path("/Volumes/My Work/Development/vedic/public")
ICONS = PUBLIC / "icons"
NAVY = (11, 15, 31, 255)
WHITE = (255, 255, 255, 255)
MASTER = 1024
SIZES = (512, 192, 180, 48, 32, 16)


def is_white(p: tuple[int, int, int, int], tol: int = 8) -> bool:
    r, g, b, a = p
    return a > 0 and r >= 255 - tol and g >= 255 - tol and b >= 255 - tol


def flood_transparent(im: Image.Image, starts: list[tuple[int, int]], tol: int = 8) -> None:
    px = im.load()
    w, h = im.size
    seen = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()
    for s in starts:
        q.append(s)
    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or seen[y][x]:
            continue
        seen[y][x] = True
        if not is_white(px[x, y], tol):
            continue
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
        q.append((x + 1, y))
        q.append((x - 1, y))
        q.append((x, y + 1))
        q.append((x, y - 1))


def content_bbox(im: Image.Image) -> tuple[int, int, int, int]:
    px = im.load()
    w, h = im.size
    xs: list[int] = []
    ys: list[int] = []
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 12:
                xs.append(x)
                ys.append(y)
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def square_pad(im: Image.Image, pad_ratio: float = 0.08) -> Image.Image:
    x0, y0, x1, y1 = content_bbox(im)
    crop = im.crop((x0, y0, x1, y1))
    cw, ch = crop.size
    side = int(max(cw, ch) * (1 + pad_ratio * 2))
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(crop, ((side - cw) // 2, (side - ch) // 2), crop)
    return canvas


def on_plate(im: Image.Image, color: tuple[int, int, int, int]) -> Image.Image:
    plate = Image.new("RGBA", im.size, color)
    plate.alpha_composite(im)
    return plate


def save_png(im: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "PNG", optimize=True)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    ICONS.mkdir(parents=True, exist_ok=True)

    raw = Image.open(SRC).convert("RGBA")
    w, h = raw.size
    flood_transparent(
        raw,
        [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, h // 2)],
        tol=12,
    )
    squared = square_pad(raw).resize((MASTER, MASTER), Image.Resampling.LANCZOS)

    trans = squared
    navy = on_plate(squared, NAVY)
    white = on_plate(squared, WHITE)

    save_png(trans, OUT / "cosmictalks-mark.png")
    save_png(navy, OUT / "cosmictalks-mark-navy.png")
    save_png(white, OUT / "cosmictalks-mark-white.png")

    for size in SIZES:
        t = trans.resize((size, size), Image.Resampling.LANCZOS)
        n = navy.resize((size, size), Image.Resampling.LANCZOS)
        u = white.resize((size, size), Image.Resampling.LANCZOS)
        save_png(t, OUT / f"cosmictalks-mark-{size}.png")
        save_png(n, OUT / f"cosmictalks-mark-{size}-navy.png")
        save_png(u, OUT / f"cosmictalks-mark-{size}-white.png")
        save_png(t, ICONS / f"cosmictalks-mark-{size}.png")
        save_png(n, ICONS / f"cosmictalks-mark-{size}-navy.png")
        save_png(u, ICONS / f"cosmictalks-mark-{size}-white.png")

    save_png(trans.resize((512, 512), Image.Resampling.LANCZOS), ICONS / "cosmictalks-mark.png")
    save_png(navy.resize((512, 512), Image.Resampling.LANCZOS), ICONS / "cosmictalks-mark-navy.png")
    save_png(white.resize((512, 512), Image.Resampling.LANCZOS), ICONS / "cosmictalks-mark-white.png")

    # Public aliases used by siteConfig today
    save_png(navy.resize((512, 512), Image.Resampling.LANCZOS), PUBLIC / "cosmictalks-icon-512.png")
    save_png(trans.resize((512, 512), Image.Resampling.LANCZOS), PUBLIC / "cosmictalks-logo.png")

    master_ico = trans.resize((256, 256), Image.Resampling.LANCZOS)
    master_ico.save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    save_png(navy.resize((180, 180), Image.Resampling.LANCZOS), PUBLIC / "apple-touch-icon.png")
    save_png(trans.resize((48, 48), Image.Resampling.LANCZOS), PUBLIC / "favicon-48.png")

    print("exported", OUT)
    print("icons", ICONS)


if __name__ == "__main__":
    main()
