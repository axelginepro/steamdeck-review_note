# Steam Reviews

Steam Reviews brings **Steam user review scores directly into Steam Deck library pages** so you can evaluate games at a glance without leaving Gaming Mode.

![Steam Reviews preview](https://github.com/AG69075/steamOS-plugin-review-score/blob/main/images/plugin_steam_review.png)

**Author:** bloodshine

## Overview

Steam Reviews is a Decky Loader plugin that patches Steam library routes and overlays each game page with a Steam review score card. It combines Steam's **official Reviews API** with a lightweight, best-effort read of the store page for the 30-day recent score — no title matching, just the `appid` that Decky already provides.

## Highlights

- Injects a review score card into Steam Deck library app/detail pages.
- Shows three scores side by side:
  - **Recent Reviews** — the 30-day score (e.g. "Mostly Positive (36)").
  - **All Reviews** — the all-time label and review count (e.g. "Mostly Positive (2,951)").
  - **Global Score** — the exact recalculated percentage (e.g. "74.09% (2,951)"), with trailing zeros trimmed (`92%`, not `92.00%`).
- Card values are grid-aligned so all three rows line up vertically.
- Steam logo sits centered on the card, next to the middle row.
- Card is responsive: it grows to fit large numbers and wraps instead of overflowing its frame, and is capped to the screen width.
- Configurable position (top-left/right/center) and offsets from the plugin's Quick Access settings panel.
- 6-hour local cache to minimize API calls.
- Card automatically hides while a game is launching.

## Data Displayed

| Field | Example |
|---|---|
| Recent Reviews | Mostly Positive (36) |
| All Reviews | Mostly Positive (2,951) |
| Global Score | 74.09% |

## How It Works

1. **Route patching** — Frontend patches library app/detail routes and mounts the Steam Reviews card component.
2. **All-time score** — Plugin calls `store.steampowered.com/appreviews/{appid}` using the game's Steam `appid`. This gives the all-time review label, positive/negative counts, and the exact score percentage.
3. **Recent score** — Steam's public JSON endpoint only ever returns all-time totals, so the 30-day "Recent Reviews" score isn't available through it. The plugin instead reads the same block Steam's own store page renders server-side, for that one `appid`. This is best-effort: if it can't be read, the Recent Reviews row is simply omitted and the rest of the card still works.
4. **Result mapping** — Frontend maps both responses into the label, score percentage, and review count shown in the card.

## Installation

1. Download the latest ZIP release from the repository releases page.
2. Transfer the ZIP file to your Steam Deck.
3. Open Decky settings on Steam Deck.
4. Go to **Developer**.
5. Select **Install Plugin from ZIP file**.

## Usage

1. Open a game page in Steam Deck Gaming Mode.
2. Open Decky and ensure Steam Reviews is enabled.
3. Return to the game page to see the Steam Reviews card.

## API Reference

The plugin fetches review data from two Steam endpoints:

**All-time score:**

```
GET https://store.steampowered.com/appreviews/{appid}?json=1&filter=all&review_type=all&purchase_type=all&language=all&num_per_page=0
```

**Recent (30-day) score** — read from the store page itself, since it isn't exposed by the JSON API above:

```
GET https://store.steampowered.com/app/{appid}/
```

Mapped result:

```json
{
  "found": true,
  "appid": 1234567,
  "all_reviews_label": "Overwhelmingly Positive",
  "all_reviews_positive": 172480,
  "all_reviews_total": 177600,
  "all_reviews_negative": 5120,
  "all_reviews_score_pct": 97.12,
  "recent_reviews_label": "Mostly Positive",
  "recent_reviews_total": 36,
  "recent_reviews_score_pct": 68,
  "store_url": "https://store.steampowered.com/app/1234567/#app_reviews_hash"
}
```
