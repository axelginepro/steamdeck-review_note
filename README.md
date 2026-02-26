# decky-steam-reviews

Plugin Decky Loader pour Steam Deck qui affiche le score d'évaluation Steam
(ex: "Very Positive", "Mixed") sur la fiche de chaque jeu dans la bibliothèque.

## Installation

1. Copie ce dossier dans `/home/deck/homebrew/plugins/decky-steam-reviews`
2. Build le frontend : `pnpm install && pnpm run build`
3. Redémarre Decky : `sudo systemctl restart plugin_loader`

## Structure

- `main.py` : Backend Python — appel API Steam + cache en mémoire
- `src/index.tsx` : Frontend React/TypeScript — affichage du score
- `plugin.json` : Métadonnées du plugin
- `package.json` : Dépendances front

## API utilisée

`https://store.steampowered.com/appreviews/<app_id>?json=1`
Champ extrait : `query_summary.review_score_desc`
