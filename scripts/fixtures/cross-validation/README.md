# Cross-validation fixtures (Phase 2)

Goldens for `npm run test:cross-validate`.

| File | Source |
|---|---|
| `swiss-ephemeris-goldens.json` | `pyswisseph` SIDM_LAHIRI + mean node (dev-only generator; **not** shipped in the product) |
| `jagannatha-hora-goldens.json` | Same SE Lahiri ganita JH uses — labeled JH-compatible |
| `drikpanchang-goldens.json` | Published Drik-style panchang limbs / sign checks |
| `last-report.json` | Last harness run summary (generated) |

Regenerate SE/JH goldens (requires local `pip install pyswisseph`):

```bash
python3 scripts/gen-se-goldens.py
```

Cases cover: modern, southern hemisphere, historical pre-1947 (wartime + LMT), approximate noon time, tropical/sidereal boundary probe.
