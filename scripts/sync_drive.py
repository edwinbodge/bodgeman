#!/usr/bin/env python3
"""Download new images from a shared Google Drive folder into inbox/.

Needs two environment variables:
  DRIVE_FOLDER_ID  the ID at the end of the folder's URL
  DRIVE_API_KEY    a Google API key with the Drive API enabled
The folder must be shared as "Anyone with the link can view".

Files that were already imported are remembered (by Drive file ID) in
data/imported_drive_ids.json, so deleting a file from Drive later does NOT
remove it from the website, and nothing is ever imported twice.
"""
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INBOX = ROOT / "inbox"
SEEN_PATH = ROOT / "data" / "imported_drive_ids.json"
API = "https://www.googleapis.com/drive/v3/files"
IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp", ".heic", ".heif"}


def get(url):
    with urllib.request.urlopen(url, timeout=120) as res:
        return res.read()


def main():
    folder = os.environ.get("DRIVE_FOLDER_ID", "").strip()
    key = os.environ.get("DRIVE_API_KEY", "").strip()
    if not folder or not key:
        print("DRIVE_FOLDER_ID / DRIVE_API_KEY not set - skipping Drive sync")
        return

    seen = set(json.loads(SEEN_PATH.read_text())) if SEEN_PATH.exists() else set()
    files, token = [], None
    while True:
        params = {
            "q": f"'{folder}' in parents and trashed = false",
            "fields": "nextPageToken, files(id, name, mimeType, createdTime)",
            "pageSize": 100,
            "key": key,
        }
        if token:
            params["pageToken"] = token
        data = json.loads(get(f"{API}?{urllib.parse.urlencode(params)}"))
        files += data.get("files", [])
        token = data.get("nextPageToken")
        if not token:
            break

    INBOX.mkdir(exist_ok=True)
    new = 0
    for f in files:
        ext = Path(f["name"]).suffix.lower()
        is_image = f["mimeType"].startswith("image/") or ext in IMAGE_EXT
        if f["id"] in seen or not is_image:
            continue
        if ext not in IMAGE_EXT:  # e.g. a photo saved without an extension
            ext = ".jpg" if "jpeg" in f["mimeType"] else "." + f["mimeType"].split("/")[-1]
        dest = INBOX / f"{Path(f['name']).stem}{ext}"
        n = 2
        while dest.exists():
            dest = INBOX / f"{Path(f['name']).stem}-{n}{ext}"
            n += 1
        try:
            dest.write_bytes(get(f"{API}/{f['id']}?{urllib.parse.urlencode({'alt': 'media', 'key': key})}"))
        except Exception as exc:
            print(f"FAILED {f['name']}: {exc}", file=sys.stderr)
            continue
        # keep upload order: older Drive files get older timestamps
        ts = datetime.fromisoformat(f["createdTime"].replace("Z", "+00:00")).timestamp()
        os.utime(dest, (ts, ts))
        seen.add(f["id"])
        new += 1
        print(f"downloaded {f['name']}")

    SEEN_PATH.parent.mkdir(exist_ok=True)
    SEEN_PATH.write_text(json.dumps(sorted(seen), indent=2) + "\n")
    print(f"{new} new image(s) from Drive")


if __name__ == "__main__":
    main()
