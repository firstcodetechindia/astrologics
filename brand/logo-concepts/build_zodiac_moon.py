#!/usr/bin/env python3
"""Build the reference moon + 12-sign wheel in CosmicTalks colors."""
from __future__ import annotations

import math
from pathlib import Path

OUT = Path(__file__).resolve().parent
CX, CY = 200.0, 168.0
R_BEAD = 132.0
BEAD_R = 22.6
R_TICK = 98.0
TICK_IN = 8.5
STROKE = 2.15
BEAD_STROKE = 1.85
GLYPH_STROKE = 1.55

# Clockwise from 12 o'clock — same order as a standard zodiac wheel.
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
    a = math.radians(deg - 90)
    return (CX + math.cos(a) * radius, CY + math.sin(a) * radius)


def f(n: float) -> str:
    return f"{n:.2f}"


def glyph(name: str) -> str:
    """Line-art glyphs in a local -10..10 box (no fill)."""
    if name == "aries":
        return (
            "M -5.2 6.4 C -5.4 1.2 -6.6 -4.2 -3.4 -6.6 C -1.6 -8.0 0 -4.6 0 -1.2 "
            "C 0 -4.6 1.6 -8.0 3.4 -6.6 C 6.6 -4.2 5.4 1.2 5.2 6.4"
        )
    if name == "taurus":
        return (
            "M -6.4 -6.2 C -8.6 -6.2 -8.8 -2.2 -6.0 -1.4 "
            "M 6.4 -6.2 C 8.6 -6.2 8.8 -2.2 6.0 -1.4 "
            "M 0 2.6 m -4.4 0 a 4.4 4.4 0 1 1 8.8 0 a 4.4 4.4 0 1 1 -8.8 0"
        )
    if name == "gemini":
        return "M -3.4 -6.6 V 6.6 M 3.4 -6.6 V 6.6 M -5.6 -6.6 H 5.6 M -5.6 6.6 H 5.6"
    if name == "cancer":
        return (
            "M -1.6 -2.2 C -6.8 -2.2 -6.8 4.8 -2.2 4.8 C 0.6 4.8 1.2 2.2 -0.4 1.4 "
            "M 1.6 2.2 C 6.8 2.2 6.8 -4.8 2.2 -4.8 C -0.6 -4.8 -1.2 -2.2 0.4 -1.4"
        )
    if name == "leo":
        return (
            "M -1.2 1.0 m -3.4 0 a 3.4 3.4 0 1 1 6.8 0 a 3.4 3.4 0 1 1 -6.8 0 "
            "M 2.0 -0.6 C 5.6 -4.8 7.2 -6.4 5.4 -7.2 C 3.8 -7.8 3.2 -5.2 4.4 -3.6 "
            "C 5.2 -2.4 6.6 1.8 5.8 5.4 C 5.2 7.6 2.8 7.2 2.8 5.4"
        )
    if name == "virgo":
        return (
            "M -6.4 6.6 V -5.2 C -6.4 -7.2 -4.2 -7.2 -4.2 -5.2 V 4.4 "
            "M -4.2 -5.2 C -4.2 -7.2 -2.0 -7.2 -2.0 -5.2 V 4.4 "
            "M -2.0 -5.2 C -2.0 -7.2 0.4 -7.2 0.4 -5.2 V 2.6 "
            "C 0.4 6.8 5.8 7.4 6.4 3.2"
        )
    if name == "libra":
        return "M -7.2 2.2 H 7.2 M -7.2 6.0 H 7.2 M -3.6 2.2 V 0.2 A 3.6 3.6 0 0 1 3.6 0.2 V 2.2"
    if name == "scorpio":
        return (
            "M -6.4 6.4 V -5.0 C -6.4 -7.0 -4.2 -7.0 -4.2 -5.0 V 4.2 "
            "M -4.2 -5.0 C -4.2 -7.0 -2.0 -7.0 -2.0 -5.0 V 4.2 "
            "M -2.0 -5.0 C -2.0 -7.0 0.4 -7.0 0.4 -5.0 V 3.6 "
            "C 0.4 6.2 3.6 6.6 5.2 4.4 L 6.6 2.6 M 4.6 2.2 L 6.8 2.4 L 6.2 4.6"
        )
    if name == "sagittarius":
        return "M -5.8 5.8 L 5.6 -5.6 M 1.2 -5.6 H 5.6 V -1.2 M -3.6 0.8 L 0.8 5.2"
    if name == "capricorn":
        return (
            "M -6.2 5.8 V -4.6 C -6.2 -6.8 -3.8 -6.8 -3.8 -4.6 V 3.4 "
            "C -3.8 6.6 0.6 7.0 2.2 4.4 C 3.4 2.4 2.4 0.6 0.6 1.2 "
            "C 3.8 -0.4 6.8 1.6 6.2 4.8 C 5.8 6.8 3.8 7.2 3.2 5.6"
        )
    if name == "aquarius":
        return (
            "M -7.0 -1.6 L -4.4 -4.4 L -1.6 -1.6 L 1.2 -4.4 L 4.0 -1.6 L 6.8 -4.4 "
            "M -7.0 3.8 L -4.4 1.0 L -1.6 3.8 L 1.2 1.0 L 4.0 3.8 L 6.8 1.0"
        )
    if name == "pisces":
        return (
            "M -2.6 -6.6 C -7.4 -3.6 -7.4 3.6 -2.6 6.6 "
            "M 2.6 -6.6 C 7.4 -3.6 7.4 3.6 2.6 6.6 "
            "M -5.4 0 H 5.4"
        )
    return ""


def spark(x: float, y: float, s: float) -> str:
    """Stroke-only 4-point spark, matching the reference line art."""
    return (
        f'<path d="M {f(x)} {f(y - s)} L {f(x + s * 0.22)} {f(y - s * 0.22)} '
        f"L {f(x + s)} {f(y)} L {f(x + s * 0.22)} {f(y + s * 0.22)} "
        f"L {f(x)} {f(y + s)} L {f(x - s * 0.22)} {f(y + s * 0.22)} "
        f"L {f(x - s)} {f(y)} L {f(x - s * 0.22)} {f(y - s * 0.22)} Z\" "
        f'stroke="url(#ct-g)" stroke-width="1.5" fill="none"/>'
    )


def defs() -> str:
    return """  <defs>
    <linearGradient id="ct-g" x1="48" y1="28" x2="352" y2="300" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6C3CFF"/>
      <stop offset="32%" stop-color="#FF5CA8"/>
      <stop offset="68%" stop-color="#FF8A3D"/>
      <stop offset="100%" stop-color="#FFC857"/>
    </linearGradient>
  </defs>"""


def icon_group() -> str:
    parts: list[str] = [f'  <g fill="none" stroke="url(#ct-g)" stroke-linecap="round" stroke-linejoin="round">']

    # Inner tick ring
    parts.append(
        f'    <circle cx="{f(CX)}" cy="{f(CY)}" r="{f(R_TICK)}" stroke-width="{STROKE}"/>'
    )
    for i in range(12):
        deg = i * 30
        x1, y1 = polar(deg, R_TICK)
        x2, y2 = polar(deg, R_TICK - TICK_IN)
        parts.append(
            f'    <line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke-width="{STROKE}"/>'
        )

    # Crescent opening right — two arcs, stroke only (same construction as the reference)
    parts.append(
        f'    <path stroke-width="2.35" d="M {f(CX - 10)} {f(CY - 48)} '
        f"A 50 50 0 1 0 {f(CX - 10)} {f(CY + 48)} "
        f'A 36 36 0 0 1 {f(CX - 10)} {f(CY - 48)}"/>'
    )
    parts.append("  </g>")

    # Three wordmark-style sparks in the moon hollow
    parts.append("  <g>")
    parts.append(f"    {spark(CX + 10, CY - 14, 5.6)}")
    parts.append(f"    {spark(CX + 22, CY + 2, 4.4)}")
    parts.append(f"    {spark(CX + 11, CY + 18, 3.5)}")
    parts.append("  </g>")

    # 12 sign beads
    parts.append(
        f'  <g fill="none" stroke="url(#ct-g)" stroke-width="{BEAD_STROKE}">'
    )
    for i, name in enumerate(SIGNS):
        deg = i * 30
        x, y = polar(deg, R_BEAD)
        parts.append(f'    <circle cx="{f(x)}" cy="{f(y)}" r="{f(BEAD_R)}"/>')
        d = glyph(name)
        # Scale local -10..10 box into the bead
        scale = 1.15
        parts.append(
            f'    <path transform="translate({f(x)} {f(y)}) scale({scale})" '
            f'd="{d}" stroke-width="{GLYPH_STROKE / scale}"/>'
        )
    parts.append("  </g>")
    return "\n".join(parts)


def write_icon() -> None:
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 336" fill="none" role="img" aria-label="CosmicTalks astrology mark">
{defs()}
{icon_group()}
</svg>
"""
    (OUT / "05-zodiac-moon-icon.svg").write_text(svg, encoding="utf-8")


def write_lockup() -> None:
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 430" fill="none" role="img" aria-label="CosmicTalks">
{defs()}
{icon_group()}
  <text x="200" y="368" text-anchor="middle" fill="url(#ct-g)"
        font-family="Avenir Next, Segoe UI, Helvetica Neue, Arial, sans-serif"
        font-size="34" font-weight="750" letter-spacing="1.2">COSMICTALKS</text>
  <text x="200" y="398" text-anchor="middle" fill="url(#ct-g)"
        font-family="Avenir Next, Segoe UI, Helvetica Neue, Arial, sans-serif"
        font-size="11" font-weight="600" letter-spacing="3.4">LET'S DECODE YOUR STARS</text>
</svg>
"""
    (OUT / "05-zodiac-moon-lockup.svg").write_text(svg, encoding="utf-8")


if __name__ == "__main__":
    write_icon()
    write_lockup()
    print("wrote 05-zodiac-moon-icon.svg and 05-zodiac-moon-lockup.svg")
