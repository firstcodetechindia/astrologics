#!/usr/bin/env python3
"""Original CosmicTalks 8-point interlocking star/flower mark (review SVG)."""
from __future__ import annotations

import math
from pathlib import Path

OUT = Path(__file__).resolve().parent
CX = CY = 64.0
R_TIP = 56.0
R_WAIST = 21.5
R_CTRL = 15.0
R_HOLE = 16.5
STROKE = 5.8
GAP = 3.4  # weave gap along path, in user units
SAMPLES = 360


def polar(deg: float, r: float) -> tuple[float, float]:
    a = math.radians(deg - 90.0)
    return (CX + math.cos(a) * r, CY + math.sin(a) * r)


def lerp(a: tuple[float, float], b: tuple[float, float], t: float) -> tuple[float, float]:
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


def dist(a: tuple[float, float], b: tuple[float, float]) -> float:
    return math.hypot(a[0] - b[0], a[1] - b[1])


def quad_point(
    p0: tuple[float, float],
    p1: tuple[float, float],
    p2: tuple[float, float],
    t: float,
) -> tuple[float, float]:
    u = 1.0 - t
    return (
        u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
        u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
    )


def star_quads(offset: float) -> list[tuple[tuple[float, float], tuple[float, float], tuple[float, float]]]:
    """Quadratic segments around one 4-pointed star."""
    segs = []
    for i in range(4):
        a0 = offset + i * 90.0
        a1 = a0 + 45.0
        a2 = a0 + 90.0
        t0 = polar(a0, R_TIP)
        w = polar(a1, R_WAIST)
        t1 = polar(a2, R_TIP)
        c0 = polar(a0 + 22.5, R_CTRL)
        c1 = polar(a1 + 22.5, R_CTRL)
        segs.append((t0, c0, w))
        segs.append((w, c1, t1))
    return segs


def sample_star(offset: float) -> list[tuple[float, float]]:
    pts: list[tuple[float, float]] = []
    segs = star_quads(offset)
    per = max(8, SAMPLES // len(segs))
    for p0, c, p2 in segs:
        for i in range(per):
            pts.append(quad_point(p0, c, p2, i / per))
    pts.append(pts[0])
    return pts


def seg_intersect(
    a: tuple[float, float],
    b: tuple[float, float],
    c: tuple[float, float],
    d: tuple[float, float],
) -> tuple[float, float] | None:
    x1, y1 = a
    x2, y2 = b
    x3, y3 = c
    x4, y4 = d
    den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if abs(den) < 1e-9:
        return None
    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
    u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / den
    if 0.02 < t < 0.98 and 0.02 < u < 0.98:
        return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))
    return None


def polyline_len(pts: list[tuple[float, float]]) -> list[float]:
    acc = [0.0]
    for i in range(1, len(pts)):
        acc.append(acc[-1] + dist(pts[i - 1], pts[i]))
    return acc


def find_crossings(
    a: list[tuple[float, float]],
    b: list[tuple[float, float]],
) -> list[tuple[float, float]]:
    hits: list[tuple[float, float]] = []
    step_a = max(1, len(a) // 80)
    step_b = max(1, len(b) // 80)
    for i in range(0, len(a) - 1, step_a):
        i2 = min(i + step_a, len(a) - 1)
        for j in range(0, len(b) - 1, step_b):
            j2 = min(j + step_b, len(b) - 1)
            p = seg_intersect(a[i], a[i2], b[j], b[j2])
            if p is None:
                continue
            if any(dist(p, q) < 2.2 for q in hits):
                continue
            # ignore crossings too close to the hole (clutter)
            if dist(p, (CX, CY)) < R_HOLE + 1.5:
                continue
            hits.append(p)
    return hits


def path_from_pts(pts: list[tuple[float, float]], closed: bool = False) -> str:
    if len(pts) < 2:
        return ""
    d = [f"M {pts[0][0]:.3f} {pts[0][1]:.3f}"]
    for x, y in pts[1:]:
        d.append(f"L {x:.3f} {y:.3f}")
    if closed:
        d.append("Z")
    return " ".join(d)


def gapped_paths(
    pts: list[tuple[float, float]],
    crossings: list[tuple[float, float]],
    under: bool,
) -> list[str]:
    """Split polyline; drop a gap around every other crossing when under=True."""
    sl = polyline_len(pts)
    total = sl[-1]
    # map each crossing to arc length on this polyline
    cuts: list[float] = []
    for c in crossings:
        best_i, best_d = 0, 1e9
        for i, p in enumerate(pts):
            dd = dist(p, c)
            if dd < best_d:
                best_d, best_i = dd, i
        cuts.append(sl[best_i])
    cuts.sort()

    # Alternate which crossings are gapped on this path
    gap_s: list[tuple[float, float]] = []
    for i, s in enumerate(cuts):
        is_gap = (i % 2 == 0) if under else (i % 2 == 1)
        if is_gap:
            gap_s.append(((s - GAP / 2) % total, (s + GAP / 2) % total))

    if not gap_s:
        return [path_from_pts(pts, closed=True)]

    # Walk the closed polyline and emit visible spans
    spans: list[list[tuple[float, float]]] = []
    current: list[tuple[float, float]] = []

    def in_gap(s: float) -> bool:
        for a, b in gap_s:
            if a <= b:
                if a <= s <= b:
                    return True
            else:
                if s >= a or s <= b:
                    return True
        return False

    for i, p in enumerate(pts[:-1]):
        if in_gap(sl[i]):
            if current:
                spans.append(current)
                current = []
        else:
            current.append(p)
    if current:
        spans.append(current)

    # merge first/last if both visible (closed path)
    if len(spans) >= 2 and not in_gap(0) and not in_gap(total - 0.01):
        spans[-1].extend(spans[0])
        spans = spans[1:]

    return [path_from_pts(s) for s in spans if len(s) > 2]


def defs() -> str:
    return """  <defs>
    <radialGradient id="ct-mark" cx="50%" cy="50%" r="52%" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="#FFC857"/>
      <stop offset="32%" stop-color="#FF8A3D"/>
      <stop offset="62%" stop-color="#FF5CA8"/>
      <stop offset="100%" stop-color="#6C3CFF"/>
    </radialGradient>
  </defs>"""


def full_mark() -> str:
    a = sample_star(0.0)
    b = sample_star(45.0)
    crossings = find_crossings(a, b)
    paths_a = gapped_paths(a, crossings, under=False)
    paths_b = gapped_paths(b, crossings, under=True)
    parts = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none" role="img" aria-label="CosmicTalks mark">',
        defs(),
        f'  <g stroke="url(#ct-mark)" stroke-width="{STROKE}" stroke-linecap="round" stroke-linejoin="round" fill="none">',
    ]
    for d in paths_a + paths_b:
        parts.append(f'    <path d="{d}"/>')
    parts.append(
        f'    <circle cx="{CX}" cy="{CY}" r="{R_HOLE}" stroke-width="{STROKE * 0.92}"/>'
    )
    parts.append("  </g>")
    parts.append("</svg>")
    return "\n".join(parts) + "\n"


def mini_mark() -> str:
    """Favicon-safe: 8-point silhouette + portal, no weave."""
    segs_a = star_quads(0.0)
    segs_b = star_quads(45.0)

    def d_from(segs):
        bits = []
        for i, (p0, c, p2) in enumerate(segs):
            if i == 0:
                bits.append(f"M {p0[0]:.2f} {p0[1]:.2f}")
            bits.append(f"Q {c[0]:.2f} {c[1]:.2f} {p2[0]:.2f} {p2[1]:.2f}")
        bits.append("Z")
        return " ".join(bits)

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none" role="img" aria-label="CosmicTalks mark">
{defs()}
  <g stroke="url(#ct-mark)" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="{d_from(segs_a)}" stroke-width="8.2"/>
    <path d="{d_from(segs_b)}" stroke-width="8.2"/>
    <circle cx="{CX}" cy="{CY}" r="{R_HOLE + 1.5}" stroke-width="8"/>
  </g>
</svg>
"""


def main() -> None:
    full = full_mark()
    mini = mini_mark()
    (OUT / "cosmictalks-mark.svg").write_text(full, encoding="utf-8")
    (OUT / "cosmictalks-mark-mini.svg").write_text(mini, encoding="utf-8")
    a = sample_star(0.0)
    b = sample_star(45.0)
    print("crossings", len(find_crossings(a, b)))
    print("wrote cosmictalks-mark.svg and cosmictalks-mark-mini.svg")


if __name__ == "__main__":
    main()
