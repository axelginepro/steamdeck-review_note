import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  staticClasses,
} from "@decky/ui";
import { callable } from "@decky/api";
import { useState, useEffect, VFC } from "react";
import { FaStar } from "react-icons/fa";

// Liaison vers la méthode Python get_review_score
const getReviewScore = callable<[app_id: string], string>("get_review_score");

/**
 * Composant principal affiché dans le panneau latéral du jeu.
 * Récupère et affiche le score d'évaluation Steam du jeu actif.
 */
const ReviewScorePanel: VFC<{ appId: number | null }> = ({ appId }) => {
  const [reviewScore, setReviewScore] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setReviewScore(null);

    // Jeux non-Steam ou absence d'app_id : on n'affiche rien
    if (!appId || appId === 0) return;

    setLoading(true);

    getReviewScore(String(appId))
      .then((score) => {
        setReviewScore(score || null);
      })
      .catch((err) => {
        console.error("[decky-steam-reviews] Failed to fetch review score:", err);
        setReviewScore(null);
      })
      .finally(() => setLoading(false));
  }, [appId]);

  if (!appId) return null;

  return (
    <PanelSection title="Steam Reviews">
      <PanelSectionRow>
        {loading ? (
          <span style={{ opacity: 0.6, fontSize: "0.85em" }}>Loading…</span>
        ) : reviewScore ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaStar style={{ color: "#c6d4df", flexShrink: 0 }} />
            <span style={{ fontSize: "0.9em", fontWeight: 500 }}>
              {reviewScore}
            </span>
          </div>
        ) : (
          <span style={{ opacity: 0.5, fontSize: "0.85em" }}>No reviews available</span>
        )}
      </PanelSectionRow>
    </PanelSection>
  );
};

/**
 * Composant injecté dans la page de détails d'un jeu de la bibliothèque Steam.
 */
const GameDetailsReviewBadge: VFC = () => {
  const appId: number | null =
    (window as any)?.appDetailsStore?.currentGame?.appid ?? null;

  return <ReviewScorePanel appId={appId} />;
};

/**
 * Point d'entrée du plugin.
 */
export default definePlugin(() => {
  return {
    name: "decky-steam-reviews",
    titleView: <div className={staticClasses.Title}>Steam Reviews</div>,
    content: <GameDetailsReviewBadge />,
    icon: <FaStar />,
    onDismount() {},
  };
});
