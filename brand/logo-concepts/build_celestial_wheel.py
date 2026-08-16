#!/usr/bin/env python3
"""Celestial zodiac wheel — same structure as the gold reference, CosmicTalks colors only."""
from __future__ import annotations

import math
from pathlib import Path

OUT = Path(__file__).resolve().parent
CX, CY = 256.0, 256.0
SW = 1.05
GLYPH_SW = 1.28

SIGNS = [
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
    "pisces",
]


def polar(deg: float, radius: float) -> tuple[float, float]:
    a = math.radians(deg - 90.0)
    return (CX + math.cos(a) * radius, CY + math.sin(a) * radius)


def f(n: float) -> str:
    v = round(float(n), 3)
    if abs(v - int(v)) < 1e-9:
        return str(int(v))
    return f"{v:.3f}".rstrip("0").rstrip(".")


def spark(x: float, y: float, s: float) -> str:
    return (
        f'<path d="M {f(x)} {f(y - s)} L {f(x + s * 0.22)} {f(y - s * 0.22)} '
        f"L {f(x + s)} {f(y)} L {f(x + s * 0.22)} {f(y + s * 0.22)} "
        f"L {f(x)} {f(y + s)} L {f(x - s * 0.22)} {f(y + s * 0.22)} "
        f"L {f(x - s)} {f(y)} L {f(x - s * 0.22)} {f(y - s * 0.22)} Z\" "
        f'fill="url(#ct-hot)"/>'
    )


def sun_path() -> str:
    r_in, r_long, r_short = 13.5, 48.0, 33.0
    d: list[str] = []
    for i in range(16):
        tip_r = r_long if i % 2 == 0 else r_short
        t = polar(i * 22.5, tip_r)
        v = polar(i * 22.5 + 11.25, r_in)
        cmd = "M" if i == 0 else "L"
        d.append(f"{cmd} {f(t[0])} {f(t[1])} L {f(v[0])} {f(v[1])}")
    d.append("Z")
    return " ".join(d)


def orb(x: float, y: float, r: float) -> str:
    hx, hy = x - r * 0.32, y - r * 0.32
    return (
        f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="url(#ct-bead)"/>'
        f'<circle cx="{f(hx)}" cy="{f(hy)}" r="{f(r * 0.28)}" fill="#fff" opacity="0.75"/>'
    )


def glyph(name: str) -> str:
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
    return f"""  <defs>
    <linearGradient id="ct-g" x1="48" y1="36" x2="460" y2="476" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6C3CFF"/>
      <stop offset="32%" stop-color="#FF5CA8"/>
      <stop offset="68%" stop-color="#FF8A3D"/>
      <stop offset="100%" stop-color="#FFC857"/>
    </linearGradient>
    <radialGradient id="ct-sun" cx="{CX}" cy="{CY}" r="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="28%" stop-color="#FFC857"/>
      <stop offset="62%" stop-color="#FF8A3D"/>
      <stop offset="100%" stop-color="#FF5CA8"/>
    </radialGradient>
    <radialGradient id="ct-hot" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#FFC857"/>
      <stop offset="100%" stop-color="#FF5CA8"/>
    </radialGradient>
    <radialGradient id="ct-bead" cx="32%" cy="28%" r="72%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="38%" stop-color="#FFC857"/>
      <stop offset="78%" stop-color="#FF5CA8"/>
      <stop offset="100%" stop-color="#6C3CFF"/>
    </radialGradient>
    <radialGradient id="ct-moon" cx="38%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#FFC857" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="#FF5CA8" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#6C3CFF" stop-opacity="0.12"/>
    </radialGradient>
    <filter id="ct-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>"""


def icon() -> str:
    parts: list[str] = [defs()]

    # Dense star-field (gold original has a galaxy of tiny dots around the sun)
    parts.append('  <g fill="url(#ct-g)" opacity="0.85">')
    phi = 137.508
    for i in range(86):
        ang = (i * phi) % 360.0
        r = 50.0 + (i * 0.78) % 68.0
        if r > 124:
            continue
        x, y = polar(ang, r)
        rad = 0.45 + (i % 6) * 0.14
        parts.append(f'    <circle cx="{f(x)}" cy="{f(y)}" r="{f(rad)}"/>')
    parts.append("  </g>")

    sparks = [
        (38, 58, 3.6), (82, 70, 2.4), (128, 56, 3.1), (176, 72, 2.2),
        (228, 60, 2.8), (274, 74, 2.3), (318, 58, 3.0), (348, 88, 2.1),
        (22, 96, 2.5), (198, 108, 2.7), (302, 110, 2.4), (64, 118, 2.0),
        (150, 122, 2.6), (250, 120, 2.2),
    ]
    parts.append("  <g>")
    for deg, r, s in sparks:
        x, y = polar(deg, r)
        parts.append(f"    {spark(x, y, s)}")
    parts.append("  </g>")

    # Inner orbits: dotted, dashed, then solid with planets
    parts.append(
        f'  <g fill="none" stroke="url(#ct-g)" stroke-width="{SW}" stroke-linecap="round">'
    )
    parts.append(
        f'    <circle cx="{f(CX)}" cy="{f(CY)}" r="68" stroke-dasharray="0.9 2.6"/>'
    )
    parts.append(
        f'    <circle cx="{f(CX)}" cy="{f(CY)}" r="88" stroke-dasharray="1.5 3.2"/>'
    )
    parts.append(f'    <circle cx="{f(CX)}" cy="{f(CY)}" r="110"/>')
    parts.append("  </g>")

    planets = [
        (18, 110, 4.4),
        (62, 110, 2.6),
        (108, 110, 3.5),
        (168, 110, 2.3),
        (214, 110, 3.8),
        (268, 110, 2.5),
        (322, 110, 3.2),
    ]
    parts.append("  <g>")
    for deg, r, rad in planets:
        x, y = polar(deg, r)
        parts.append(f"    {orb(x, y, rad)}")
    parts.append("  </g>")

    # Filled crescent, lower-left, opening toward the sun
    parts.append(
        f'  <path fill="url(#ct-moon)" stroke="url(#ct-g)" stroke-width="1.7" '
        f'stroke-linejoin="round" '
        f'd="M {f(CX - 8)} {f(CY - 62)} '
        f"A 78 78 0 1 0 {f(CX + 58)} {f(CY + 48)} "
        f'A 58 58 0 0 1 {f(CX - 8)} {f(CY - 62)}"/>'
    )

    # Sun with glow
    parts.append(
        f'  <circle cx="{f(CX)}" cy="{f(CY)}" r="40" fill="url(#ct-sun)" opacity="0.32" filter="url(#ct-glow)"/>'
    )
    parts.append(f'  <path d="{sun_path()}" fill="url(#ct-sun)" filter="url(#ct-glow)"/>')
    parts.append(f'  <circle cx="{f(CX)}" cy="{f(CY)}" r="12.2" fill="url(#ct-hot)"/>')

    # Zodiac band
    r_in, r_out, r_rim = 136.0, 186.0, 198.0
    parts.append(
        f'  <g fill="none" stroke="url(#ct-g)" stroke-width="{SW}" stroke-linecap="round">'
    )
    parts.append(f'    <circle cx="{f(CX)}" cy="{f(CY)}" r="{f(r_in)}"/>')
    parts.append(f'    <circle cx="{f(CX)}" cy="{f(CY)}" r="{f(r_out)}"/>')
    parts.append(f'    <circle cx="{f(CX)}" cy="{f(CY)}" r="{f(r_rim)}"/>')
    for i in range(12):
        ang = 15.0 + i * 30.0
        a = polar(ang, r_in)
        b = polar(ang, r_out)
        parts.append(
            f'    <line x1="{f(a[0])}" y1="{f(a[1])}" x2="{f(b[0])}" y2="{f(b[1])}"/>'
        )
    parts.append("  </g>")

    parts.append("  <g>")
    for i in range(12):
        ang = 15.0 + i * 30.0
        for rr in (148.0, 161.0, 174.0):
            x, y = polar(ang, rr)
            parts.append(f"    {orb(x, y, 1.85)}")
    for ang in (0.0, 90.0, 180.0, 270.0):
        x, y = polar(ang, r_rim)
        parts.append(f"    {orb(x, y, 6.1)}")
    parts.append("  </g>")

    r_g = (r_in + r_out) / 2.0
    parts.append(
        f'  <g fill="none" stroke="url(#ct-g)" stroke-width="{GLYPH_SW}" '
        f'stroke-linecap="round" stroke-linejoin="round">'
    )
    for i, name in enumerate(SIGNS):
        x, y = polar(i * 30.0, r_g)
        scale = 1.62
        parts.append(
            f'    <path transform="translate({f(x)} {f(y)}) scale({scale})" '
            f'd="{glyph(name)}" stroke-width="{GLYPH_SW / scale:.3f}"/>'
        )
    parts.append("  </g>")

    return "\n".join(parts)


def main() -> None:
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" role="img" aria-label="CosmicTalks celestial wheel">
{icon()}
</svg>
"""
    (OUT / "07-celestial-wheel.svg").write_text(svg, encoding="utf-8")
    print("wrote 07-celestial-wheel.svg")


if __name__ == "__main__":
    main()
