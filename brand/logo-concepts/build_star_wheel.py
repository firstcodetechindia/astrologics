#!/usr/bin/env python3
"""Connected hexagram + 12-sign wheel — same structure as the navy reference."""
from __future__ import annotations

import math
from pathlib import Path

OUT = Path(__file__).resolve().parent
CX, CY = 200.0, 200.0
# Bead centers sit ON the connecting ring so the circle runs through every sign.
R = 148.0
BEAD_R = 27.0
SW = 3.6
GLYPH_SW = 1.7
R_HEX = R / math.sqrt(3.0)

# Clockwise from 12 o'clock — same order as the navy reference.
SIGNS = [
    "aries",
    "pisces",
    "aquarius",
    "capricorn",
    "sagittarius",
    "scorpio",
    "libra",
    "virgo",
    "leo",
    "cancer",
    "gemini",
    "taurus",
]


def polar(deg: float, radius: float = R) -> tuple[float, float]:
    a = math.radians(deg - 90.0)
    return (CX + math.cos(a) * radius, CY + math.sin(a) * radius)


def f(n: float) -> str:
    v = round(n, 3)
    if abs(v - int(v)) < 1e-9:
        return str(int(v))
    return f"{v:.3f}".rstrip("0").rstrip(".")


def tri(degs: list[float], radius: float = R) -> str:
    pts = [polar(d, radius) for d in degs]
    d = [f"M {f(pts[0][0])} {f(pts[0][1])}"]
    for x, y in pts[1:]:
        d.append(f"L {f(x)} {f(y)}")
    d.append("Z")
    return " ".join(d)


def hexagon(offset: float = 30.0) -> str:
    """Inner hexagon formed by the two-triangle hexagram (circumradius R/sqrt(3))."""
    r = R / math.sqrt(3.0)
    pts = [polar(offset + i * 60.0, r) for i in range(6)]
    d = [f"M {f(pts[0][0])} {f(pts[0][1])}"]
    for x, y in pts[1:]:
        d.append(f"L {f(x)} {f(y)}")
    d.append("Z")
    return " ".join(d)


def glyph(name: str) -> str:
    """Monoline glyphs in a local -9..9 box."""
    g = {
        "aries": (
            "M -4.8 6.2 C -5 1.4 -6.2 -4.4 -3.2 -6.4 C -1.6 -7.6 0 -4.2 0 -0.8 "
            "C 0 -4.2 1.6 -7.6 3.2 -6.4 C 6.2 -4.4 5 1.4 4.8 6.2"
        ),
        "taurus": (
            "M -5.8 -6.2 C -8.2 -6.2 -8.4 -2.4 -5.4 -1.6 "
            "M 5.8 -6.2 C 8.2 -6.2 8.4 -2.4 5.4 -1.6 "
            "M 0 2.4 m -4.2 0 a 4.2 4.2 0 1 1 8.4 0 a 4.2 4.2 0 1 1 -8.4 0"
        ),
        "gemini": "M -3.2 -6.4 V 6.4 M 3.2 -6.4 V 6.4 M -5.4 -6.4 H 5.4 M -5.4 6.4 H 5.4",
        "cancer": (
            "M -1.4 -2 C -6.4 -2 -6.4 4.6 -2 4.6 C 0.6 4.6 1.2 2.2 -0.2 1.4 "
            "M 1.4 2 C 6.4 2 6.4 -4.6 2 -4.6 C -0.6 -4.6 -1.2 -2.2 0.2 -1.4"
        ),
        "leo": (
            "M -1.4 1.2 m -3.2 0 a 3.2 3.2 0 1 1 6.4 0 a 3.2 3.2 0 1 1 -6.4 0 "
            "M 1.8 -0.4 C 5.4 -4.6 6.8 -6.2 5.2 -7 C 3.6 -7.6 3.2 -5 4.4 -3.4 "
            "C 5.2 -2.2 6.4 1.8 5.6 5.2 C 5 7.2 2.6 6.8 2.6 5"
        ),
        "virgo": (
            "M -6.2 6.4 V -5 C -6.2 -7 -4.2 -7 -4.2 -5 V 4.2 "
            "M -4.2 -5 C -4.2 -7 -2.2 -7 -2.2 -5 V 4.2 "
            "M -2.2 -5 C -2.2 -7 0.2 -7 0.2 -5 V 2.4 "
            "C 0.2 6.6 5.4 7.2 6.2 3"
        ),
        "libra": "M -6.8 2 H 6.8 M -6.8 5.8 H 6.8 M -3.4 2 V 0.2 A 3.4 3.4 0 0 1 3.4 0.2 V 2",
        "scorpio": (
            "M -6.2 6.2 V -4.8 C -6.2 -6.8 -4.2 -6.8 -4.2 -4.8 V 4 "
            "M -4.2 -4.8 C -4.2 -6.8 -2.2 -6.8 -2.2 -4.8 V 4 "
            "M -2.2 -4.8 C -2.2 -6.8 0.2 -6.8 0.2 -4.8 V 3.4 "
            "C 0.2 6 3.4 6.4 5 4.2 L 6.4 2.4 M 4.4 2 L 6.6 2.2 L 6 4.4"
        ),
        "sagittarius": "M -5.6 5.6 L 5.4 -5.4 M 1.2 -5.4 H 5.4 V -1.2 M -3.4 0.6 L 0.8 4.8",
        "capricorn": (
            "M -6 5.6 V -4.4 C -6 -6.6 -3.8 -6.6 -3.8 -4.4 V 3.2 "
            "C -3.8 6.4 0.4 6.8 2 4.2 C 3.2 2.2 2.2 0.4 0.4 1 "
            "C 3.6 -0.6 6.6 1.4 6 4.6 C 5.6 6.6 3.6 7 3 5.4"
        ),
        "aquarius": (
            "M -6.8 -1.6 L -4.2 -4.2 L -1.6 -1.6 L 1.0 -4.2 L 3.6 -1.6 L 6.4 -4.2 "
            "M -6.8 3.6 L -4.2 1.0 L -1.6 3.6 L 1.0 1.0 L 3.6 3.6 L 6.4 1.0"
        ),
        "pisces": (
            "M -2.4 -6.4 C -7 -3.4 -7 3.4 -2.4 6.4 "
            "M 2.4 -6.4 C 7 -3.4 7 3.4 2.4 6.4 "
            "M -5.2 0 H 5.2"
        ),
    }
    return g[name]


def defs() -> str:
    return """  <defs>
    <linearGradient id="ct-g" x1="40" y1="40" x2="360" y2="360" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6C3CFF"/>
      <stop offset="32%" stop-color="#FF5CA8"/>
      <stop offset="68%" stop-color="#FF8A3D"/>
      <stop offset="100%" stop-color="#FFC857"/>
    </linearGradient>
  </defs>"""


def lerp(a: tuple[float, float], b: tuple[float, float], t: float) -> tuple[float, float]:
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


def icon_group() -> str:
    parts: list[str] = [
        f'  <g fill="none" stroke="url(#ct-g)" stroke-width="{SW}" '
        f'stroke-linecap="round" stroke-linejoin="miter" stroke-miterlimit="10">'
    ]

    # Ring through every bead center — this is what keeps the 12 signs connected.
    parts.append(f'    <circle cx="{f(CX)}" cy="{f(CY)}" r="{f(R)}"/>')

    # ONE hexagram only (Star of David). Inner hexagon is the empty hole — no extra web.
    parts.append(f'    <path d="{tri([0, 120, 240])}"/>')
    parts.append(f'    <path d="{tri([60, 180, 300])}"/>')

    # Six spokes from the hexagon vertices into the remaining six sign beads.
    for k in range(6):
        ang = 30.0 + 60.0 * k
        h = polar(ang, R_HEX)
        tip = polar(ang, R)
        parts.append(
            f'    <line x1="{f(h[0])}" y1="{f(h[1])}" x2="{f(tip[0])}" y2="{f(tip[1])}"/>'
        )

    for i in range(12):
        x, y = polar(i * 30.0)
        parts.append(f'    <circle cx="{f(x)}" cy="{f(y)}" r="{f(BEAD_R)}"/>')

    parts.append("  </g>")

    parts.append(
        f'  <g fill="none" stroke="url(#ct-g)" stroke-width="{GLYPH_SW}" '
        f'stroke-linecap="round" stroke-linejoin="round">'
    )
    for i, name in enumerate(SIGNS):
        x, y = polar(i * 30.0)
        scale = 1.18
        parts.append(
            f'    <path transform="translate({f(x)} {f(y)}) scale({scale})" '
            f'd="{glyph(name)}" stroke-width="{GLYPH_SW / scale:.3f}"/>'
        )
    parts.append("  </g>")
    return "\n".join(parts)


def write_icon() -> None:
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" role="img" aria-label="CosmicTalks mark">
{defs()}
{icon_group()}
</svg>
"""
    (OUT / "06-star-wheel-icon.svg").write_text(svg, encoding="utf-8")


def write_lockup() -> None:
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="none" role="img" aria-label="CosmicTalks">
{defs()}
{icon_group()}
  <text x="200" y="430" text-anchor="middle" fill="url(#ct-g)"
        font-family="Avenir Next, Segoe UI, Helvetica Neue, Arial, sans-serif"
        font-size="32" font-weight="750" letter-spacing="1.4">COSMICTALKS</text>
  <text x="200" y="458" text-anchor="middle" fill="url(#ct-g)"
        font-family="Avenir Next, Segoe UI, Helvetica Neue, Arial, sans-serif"
        font-size="10.5" font-weight="600" letter-spacing="3.6">LET'S DECODE YOUR STARS</text>
</svg>
"""
    (OUT / "06-star-wheel-lockup.svg").write_text(svg, encoding="utf-8")


if __name__ == "__main__":
    write_icon()
    write_lockup()
    print("wrote 06-star-wheel-icon.svg and 06-star-wheel-lockup.svg")
