# Steam Reviews

Steam Reviews brings **Steam user review scores directly into Steam Deck library pages** so you can evaluate games at a glance without leaving Gaming Mode.

![Steam Reviews preview](https://github.com/AG69075/steamOS-plugin-review-score/blob/main/images/plugin_steam_review.png)

**Author:** bloodshine

## Overview

Steam Reviews is a Decky Loader plugin that patches Steam library routes and overlays each game page with a Steam review score card. It uses the **official Steam Reviews API** — no scraping, no title matching — just the `appid` that Decky already provides.

## Highlights

- Injects a review score card into Steam Deck library app/detail pages.
- Displays the **All Reviews** label (e.g. "Very Positive", "Overwhelmingly Positive").
- Shows the **score percentage** and **total review count**.
- Uses the **official Steam Reviews API** — reliable and always up to date.
- 6-hour local cache to minimize API calls.
- Card automatically hides while a game is launching.

## Data Displayed

| Field | Example |
|---|---|
| All Reviews | Overwhelmingly Positive (172,480) |
| Score | 94.40% |

## How It Works

1. **Route patching** — Frontend patches library app/detail routes and mounts the Steam Reviews card component.
2. **Score lookup** — Plugin calls `store.steampowered.com/appreviews/{appid}` using the game's Steam `appid` (no title matching needed).
3. **Result mapping** — Frontend maps the response into a review label, score percentage, and review count.

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

The plugin fetches review data directly from Steam's public endpoint:

```
GET https://store.steampowered.com/appreviews/{appid}?json=1&filter=all&review_type=all&purchase_type=all&language=all&num_per_page=0
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
  "store_url": "https://store.steampowered.com/app/1234567/#app_reviews_hash"
}
```
