#!/usr/bin/env python3
"""Turn raw card images dropped in inbox/ into web-ready files.

For every image in inbox/ this script:
  * writes a full-size version  -> images/cards/<name>.webp   (max 1400px)
  * writes a thumbnail          -> images/cards/thumbs/<name>.webp (max 480px wide)
  * adds the card to the FRONT of data/cards.json (newest first)
  * removes the original from inbox/

The home page and gallery page both read data/cards.json, so nothing else
needs to be edited when a card is added.
"""
import argparse
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

try:  # iPhone photos are often HEIC
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass

ROOT = Path(__file__).resolve().parent.parent
EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".heic", ".heif"}
FULL_MAX = 1400
THUMB_MAX_WIDTH = 480


def natural_key(text):
    return [int(p) if p.isdigit() else p.lower() for p in re.split(r"(\d+)", text)]


def slugify(stem):
    slug = re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")
    return slug or "card"


def unique_name(slug, taken):
    name, n = slug, 2
    while name in taken:
        name = f"{slug}-{n}"
        n += 1
    return name


def save_webp(img, path, max_w, max_h):
    img = img.copy()
    img.thumbnail((max_w, max_h), Image.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "WEBP", quality=82, method=6)
    return img.size


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--inbox", default=str(ROOT / "inbox"))
    parser.add_argument("--sort", choices=["mtime", "name"], default="mtime",
                        help="order of a batch: later items end up first on the site")
    args = parser.parse_args()

    inbox = Path(args.inbox)
    manifest_path = ROOT / "data" / "cards.json"
    cards_dir = ROOT / "images" / "cards"

    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {"cards": []}
    cards = manifest["cards"]
    taken = {c["id"] for c in cards}

    files = [p for p in inbox.glob("*") if p.suffix.lower() in EXTENSIONS]
    if args.sort == "name":
        files.sort(key=lambda p: natural_key(p.name))
    else:
        files.sort(key=lambda p: (p.stat().st_mtime, natural_key(p.name)))

    added = []
    for path in files:
        try:
            img = ImageOps.exif_transpose(Image.open(path))
            img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
        except Exception as exc:  # unreadable file: leave it in place, keep going
            print(f"SKIP {path.name}: {exc}", file=sys.stderr)
            continue
        name = unique_name(slugify(path.stem), taken)
        taken.add(name)
        w, h = save_webp(img, cards_dir / f"{name}.webp", FULL_MAX, FULL_MAX)
        save_webp(img, cards_dir / "thumbs" / f"{name}.webp", THUMB_MAX_WIDTH, 10_000)
        added.append({"id": name, "file": f"images/cards/{name}.webp",
                      "thumb": f"images/cards/thumbs/{name}.webp", "w": w, "h": h})
        path.unlink()
        print(f"added {name} ({w}x{h})")

    if added:
        manifest["cards"] = list(reversed(added)) + cards
        manifest_path.parent.mkdir(exist_ok=True)
        manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    else:
        print("nothing new in inbox/")


if __name__ == "__main__":
    main()
