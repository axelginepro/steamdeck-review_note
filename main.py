import asyncio
import aiohttp
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("decky-steam-reviews")

class Plugin:
    # Cache en mémoire : { app_id (str) -> review_score_desc (str) }
    _review_cache: dict = {}

    async def get_review_score(self, app_id: str) -> str:
        """
        Retourne le texte du score d'évaluation Steam pour un app_id donné.
        Utilise un cache en mémoire pour éviter de sur-solliciter l'API Steam.
        """
        if app_id in self._review_cache:
            logger.info(f"[Cache hit] app_id={app_id} -> {self._review_cache[app_id]}")
            return self._review_cache[app_id]

        url = f"https://store.steampowered.com/appreviews/{app_id}?json=1"
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status != 200:
                        logger.warning(f"Steam API returned HTTP {response.status} for app_id={app_id}")
                        return ""

                    data = await response.json()

                    review_score_desc = (
                        data
                        .get("query_summary", {})
                        .get("review_score_desc", "")
                    )

                    if not review_score_desc or review_score_desc.lower() == "no user reviews":
                        logger.info(f"No reviews found for app_id={app_id}")
                        return ""

                    self._review_cache[app_id] = review_score_desc
                    logger.info(f"[Cache store] app_id={app_id} -> {review_score_desc}")
                    return review_score_desc

        except asyncio.TimeoutError:
            logger.error(f"Timeout fetching reviews for app_id={app_id}")
            return ""
        except Exception as e:
            logger.error(f"Error fetching reviews for app_id={app_id}: {e}")
            return ""

    async def clear_cache(self) -> None:
        """Vide le cache en mémoire."""
        self._review_cache.clear()
        logger.info("Review cache cleared.")

    async def _main(self):
        logger.info("decky-steam-reviews plugin started.")

    async def _unload(self):
        logger.info("decky-steam-reviews plugin unloaded.")
        self._review_cache.clear()
