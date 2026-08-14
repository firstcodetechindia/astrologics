"""
GeoNames IN.txt -> Clean JSON converter
Converts the raw GeoNames India export into a structured JSON file
ready to import into SQLite/Postgres/Meilisearch for the Kundli
birth-place autocomplete feature.

USAGE:
    1. Place IN.txt and admin1CodesASCII.txt in the same folder as this script
    2. Run: python geonames_to_json.py
    3. Output: india_places.json (clean, structured) and
               india_places.jsonl (newline-delimited, easier to stream/import)

WHY WE FILTER: GeoNames includes ALL geographic features (rivers, hills,
mountains, buildings) not just towns/villages. We filter to feature_class 'P'
(populated places) only -- this is what you actually want for a birth-place
selector.
"""

import csv
import json
import sys

IN_TXT_PATH = "IN.txt"
ADMIN1_CODES_PATH = "admin1CodesASCII.txt"
OUTPUT_JSON_PATH = "india_places.json"
OUTPUT_JSONL_PATH = "india_places.jsonl"

# GeoNames column order (0-indexed) for the main country dump file
COL_GEONAMEID = 0
COL_NAME = 1
COL_ASCIINAME = 2
COL_ALTERNATENAMES = 3
COL_LATITUDE = 4
COL_LONGITUDE = 5
COL_FEATURE_CLASS = 6
COL_FEATURE_CODE = 7
COL_COUNTRY_CODE = 8
COL_ADMIN1_CODE = 10
COL_ADMIN2_CODE = 11
COL_POPULATION = 14
COL_TIMEZONE = 17


def load_admin1_names(path):
    """
    admin1CodesASCII.txt format (tab-separated, no header):
    code    name    name_ascii    geonameid
    e.g.:   IN.16   Uttar Pradesh   Uttar Pradesh   1252479
    Returns a dict: {"16": "Uttar Pradesh", "07": "Delhi", ...}
    """
    admin1_map = {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            reader = csv.reader(f, delimiter="\t")
            for row in reader:
                if not row or len(row) < 2:
                    continue
                code_full = row[0]  # e.g. "IN.16"
                state_name = row[1]
                if code_full.startswith("IN."):
                    admin1_code = code_full.split(".", 1)[1]  # "16"
                    admin1_map[admin1_code] = state_name
    except FileNotFoundError:
        print(f"WARNING: {path} not found. State names will be blank.")
        print("Download it from: https://download.geonames.org/export/dump/admin1CodesASCII.txt")
    return admin1_map


def convert(in_txt_path, admin1_map, min_population=0):
    """
    Reads IN.txt and yields clean dict records for populated places only.

    min_population: set to e.g. 1000 if you want to skip tiny hamlets and
    keep the dataset smaller initially. Set to 0 to keep everything
    (recommended for a "no place left behind" birth-place tool, since
    Vedic astrology needs exact birth town, however small).
    """
    with open(in_txt_path, "r", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter="\t")
        for row in reader:
            if len(row) < 19:
                continue  # skip malformed/short rows

            feature_class = row[COL_FEATURE_CLASS]
            if feature_class != "P":  # P = populated place (city/town/village)
                continue

            try:
                population = int(row[COL_POPULATION]) if row[COL_POPULATION] else 0
            except ValueError:
                population = 0

            if population < min_population:
                continue

            admin1_code = row[COL_ADMIN1_CODE]
            state_name = admin1_map.get(admin1_code, "")

            alternatenames_raw = row[COL_ALTERNATENAMES]
            alternatenames = (
                [a.strip() for a in alternatenames_raw.split(",") if a.strip()]
                if alternatenames_raw
                else []
            )

            try:
                lat = float(row[COL_LATITUDE])
                lng = float(row[COL_LONGITUDE])
            except ValueError:
                continue  # skip rows with unparseable coordinates

            record = {
                "id": row[COL_GEONAMEID],
                "name": row[COL_NAME],
                "ascii_name": row[COL_ASCIINAME],
                "alternate_names": alternatenames,
                "state": state_name,
                "country": "India",
                "country_code": row[COL_COUNTRY_CODE],
                "lat": lat,
                "lng": lng,
                "timezone": row[COL_TIMEZONE],
                "population": population,
                "feature_code": row[COL_FEATURE_CODE],  # PPL, PPLA, PPLC etc.
            }
            yield record


def main():
    admin1_map = load_admin1_names(ADMIN1_CODES_PATH)

    records = list(convert(IN_TXT_PATH, admin1_map, min_population=0))

    print(f"Converted {len(records)} populated places.")

    # Write full JSON array
    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=None)
    print(f"Wrote {OUTPUT_JSON_PATH}")

    # Write JSONL (newline-delimited) -- easier for streaming import into a DB
    with open(OUTPUT_JSONL_PATH, "w", encoding="utf-8") as f:
        for r in records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"Wrote {OUTPUT_JSONL_PATH}")

    # Quick sanity check -- print a couple sample records
    print("\nSample records:")
    for r in records[:3]:
        print(json.dumps(r, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
