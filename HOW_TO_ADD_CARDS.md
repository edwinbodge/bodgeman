# Adding new cards

## For Dad (every time there's a new card)

1. Open the **Bodgeman Cards** folder in Google Drive (on your phone or computer).
2. Drag in (or upload) a photo or scan of the new card. JPG, PNG and iPhone photos all work.
3. That's it. Within about 6 hours the card shows up on the website, in the Gallery
   (newest first) and in the random selection on the home page.

Tips: crop the photo to just the card first. Several cards at once is fine.
Deleting a file from Drive later does **not** take it off the website (see below).

## One-time setup (whoever manages the site)

The site is static (GitHub Pages), so a small GitHub Action (`.github/workflows/add-cards.yml`)
does the work: it copies new images out of the Drive folder, shrinks them for the web,
adds them to `data/cards.json`, and commits. GitHub Pages then republishes automatically.

1. **Make the Drive folder.** In Google Drive create a folder (e.g. "Bodgeman Cards"),
   share it with Dad (Editor), and set General access to **"Anyone with the link" → Viewer**.
   Copy the folder ID: it's the last part of the folder's URL (`drive.google.com/drive/folders/<THIS PART>`).
2. **Create an API key.** In [Google Cloud Console](https://console.cloud.google.com/) create a project,
   enable the **Google Drive API**, then *APIs & Services → Credentials → Create credentials → API key*.
   Restrict the key to the Drive API. (The key can only read files already shared publicly.)
3. **Add them to GitHub** (repo → Settings → Secrets and variables → Actions):
   - *Variables* tab → new variable `DRIVE_FOLDER_ID` = the folder ID
   - *Secrets* tab → new secret `DRIVE_API_KEY` = the API key
4. **Test it.** Drop an image in the Drive folder, then go to the repo's *Actions* tab →
   "Add new cards" → *Run workflow*. After it finishes, the card should appear on the site within a minute or two.

Notes:
- GitHub pauses scheduled workflows after 60 days with no repo activity. If Dad goes a couple of
  months without a new card, just click *Run workflow* once to wake it up.
- No Drive? Anyone with repo access can instead use *Add file → Upload files* to put images into the
  `inbox/` folder; the same Action processes them on the spot.

## Removing a card

Delete its `.webp` from `images/cards/` and `images/cards/thumbs/`, and its entry from `data/cards.json`.

## Running locally

```
pip install -r scripts/requirements.txt
cp ~/Downloads/new-card.jpg inbox/
python3 scripts/process_cards.py
```
