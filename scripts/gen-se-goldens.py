"""
Dev-only: regenerate Swiss Ephemeris goldens.
Requires: pip install pyswisseph
NOT a product dependency — AGPL SE must not ship with CosmicGPT.

Run: python3 scripts/gen-se-goldens.py
"""
import json
import os
import swisseph as swe

swe.set_ephe_path("")
swe.set_sid_mode(swe.SIDM_LAHIRI)

SIGNS = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
]
NAK = [
    "Ashwini",
    "Bharani",
    "Krittika",
    "Rohini",
    "Mrigashira",
    "Ardra",
    "Punarvasu",
    "Pushya",
    "Ashlesha",
    "Magha",
    "Purva Phalguni",
    "Uttara Phalguni",
    "Hasta",
    "Chitra",
    "Swati",
    "Vishakha",
    "Anuradha",
    "Jyeshtha",
    "Mula",
    "Purva Ashadha",
    "Uttara Ashadha",
    "Shravana",
    "Dhanishta",
    "Shatabhisha",
    "Purva Bhadrapada",
    "Uttara Bhadrapada",
    "Revati",
]
BODIES = {
    "sun": swe.SUN,
    "moon": swe.MOON,
    "mercury": swe.MERCURY,
    "venus": swe.VENUS,
    "mars": swe.MARS,
    "jupiter": swe.JUPITER,
    "saturn": swe.SATURN,
    "rahu": swe.MEAN_NODE,
}


def jd_ut(y, m, d, hh, mm, offset_hours):
    ut = hh + mm / 60 - offset_hours
    return swe.julday(y, m, d, ut)


def meta(lon):
    lon = lon % 360.0
    si = int(lon // 30)
    deg = lon % 30
    span = 360.0 / 27.0
    ni = int(lon // span) % 27
    pada = int((lon % span) // (span / 4)) + 1
    return {
        "longitude": round(lon, 4),
        "sign": SIGNS[si],
        "degreeInSign": round(deg, 4),
        "nakshatra": NAK[ni],
        "pada": pada,
    }


CASES = [
    {
        "id": "delhi_1990_dawn",
        "category": "modern",
        "name": "Delhi dawn",
        "date": "1990-05-15",
        "time": "06:30",
        "place": "New Delhi",
        "lat": 28.6139,
        "lon": 77.209,
        "timeZone": "Asia/Kolkata",
        "offsetHours": 5.5,
    },
    {
        "id": "mumbai_1985_night",
        "category": "modern",
        "name": "Mumbai night",
        "date": "1985-12-01",
        "time": "23:45",
        "place": "Mumbai",
        "lat": 19.076,
        "lon": 72.8777,
        "timeZone": "Asia/Kolkata",
        "offsetHours": 5.5,
    },
    {
        "id": "sydney_1988",
        "category": "southern_hemisphere",
        "name": "Sydney",
        "date": "1988-07-04",
        "time": "09:15",
        "place": "Sydney",
        "lat": -33.8688,
        "lon": 151.2093,
        "timeZone": "Australia/Sydney",
        "offsetHours": 10.0,
    },
    {
        "id": "kolkata_1941_wartime",
        "category": "historical_pre1947",
        "name": "Kolkata wartime",
        "date": "1941-10-01",
        "time": "12:00",
        "place": "Kolkata",
        "lat": 22.5726,
        "lon": 88.3639,
        "timeZone": "Asia/Kolkata",
        "offsetHours": 6.5,
    },
    {
        "id": "delhi_1900_lmt",
        "category": "historical_pre1947",
        "name": "Delhi 1900",
        "date": "1900-06-15",
        "time": "12:00",
        "place": "Delhi",
        "lat": 28.6139,
        "lon": 77.209,
        "timeZone": "Asia/Kolkata",
        "offsetHours": 5 + (21 + 10 / 60) / 60,
    },
    {
        "id": "approx_time_noon",
        "category": "approximate_time",
        "name": "Approx noon only",
        "date": "1995-03-21",
        "time": "12:00",
        "place": "Varanasi",
        "lat": 25.3176,
        "lon": 82.9739,
        "timeZone": "Asia/Kolkata",
        "offsetHours": 5.5,
        "notes": "Approximate birth time modeled as local noon",
    },
    {
        "id": "sign_cusp_probe",
        "category": "boundary",
        "name": "Near tropical Aries ingress (sidereal Sun still Pisces)",
        "date": "2024-03-20",
        "time": "12:00",
        "place": "Delhi",
        "lat": 28.61,
        "lon": 77.21,
        "timeZone": "Asia/Kolkata",
        "offsetHours": 5.5,
    },
    {
        "id": "london_2000",
        "category": "modern",
        "name": "London Y2K",
        "date": "2000-01-01",
        "time": "00:00",
        "place": "London",
        "lat": 51.5074,
        "lon": -0.1278,
        "timeZone": "Europe/London",
        "offsetHours": 0.0,
    },
]


def main():
    out = []
    for c in CASES:
        y, m, d = map(int, c["date"].split("-"))
        hh, mm = map(int, c["time"].split(":"))
        jd = jd_ut(y, m, d, hh, mm, c["offsetHours"])
        flags = swe.FLG_SWIEPH | swe.FLG_SIDEREAL
        aya = swe.get_ayanamsa_ut(jd)
        planets = {}
        for pid, body in BODIES.items():
            try:
                xx, _ret = swe.calc_ut(jd, body, flags)
            except Exception:
                xx, _ret = swe.calc_ut(jd, body, swe.FLG_MOSEPH | swe.FLG_SIDEREAL)
            lon = xx[0]
            planets[pid] = meta(lon)
            if pid == "rahu":
                planets["ketu"] = meta((lon + 180) % 360)
        cusps, ascmc = swe.houses(jd, c["lat"], c["lon"], b"P")
        asc = (ascmc[0] - aya) % 360
        row = {
            k: c[k]
            for k in [
                "id",
                "category",
                "name",
                "date",
                "time",
                "place",
                "lat",
                "lon",
                "timeZone",
            ]
        }
        row.update(
            {
                "source": "swiss_ephemeris",
                "sourceDetail": "pyswisseph SIDM_LAHIRI + MEAN_NODE; lagna=Placidus ASC trop−Lahiri",
                "jd_ut": jd,
                "ayanamsa": round(aya, 6),
                "lagna": meta(asc),
                "planets": planets,
            }
        )
        if c.get("notes"):
            row["notes"] = c["notes"]
        out.append(row)
        print(c["id"], "OK")

    root = os.path.join(os.path.dirname(__file__), "fixtures", "cross-validation")
    os.makedirs(root, exist_ok=True)
    path = os.path.join(root, "swiss-ephemeris-goldens.json")
    with open(path, "w") as f:
        json.dump(
            {
                "generatedBy": "scripts/gen-se-goldens.py (dev only)",
                "ayanamsa": "Lahiri SIDM_LAHIRI",
                "node": "mean",
                "cases": out,
            },
            f,
            indent=2,
        )
    # JH uses Swiss Ephemeris for ganita — same planet goldens, labeled for harness.
    jh_path = os.path.join(root, "jagannatha-hora-goldens.json")
    with open(jh_path, "w") as f:
        json.dump(
            {
                "generatedBy": "scripts/gen-se-goldens.py",
                "note": "Jagannatha Hora planet positions use Swiss Ephemeris + Lahiri; these goldens are SE SIDM_LAHIRI outputs for the same inputs (JH-compatible ganita layer).",
                "ayanamsa": "Lahiri",
                "node": "mean",
                "cases": [
                    {**c, "source": "jagannatha_hora_via_swiss_ephemeris"} for c in out
                ],
            },
            f,
            indent=2,
        )
    print("wrote", path)
    print("wrote", jh_path)


if __name__ == "__main__":
    main()
