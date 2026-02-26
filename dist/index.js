(function (ui, api, react) {
    'use strict';

    const getReviewScore = api.callable("get_review_score");
    const ReviewScorePanel = ({ appId }) => {
        const [reviewScore, setReviewScore] = react.useState(null);
        const [loading, setLoading] = react.useState(false);
        react.useEffect(() => {
            setReviewScore(null);
            if (!appId || appId === 0)
                return;
            setLoading(true);
            getReviewScore(String(appId))
                .then((score) => { setReviewScore(score || null); })
                .catch(() => setReviewScore(null))
                .finally(() => setLoading(false));
        }, [appId]);
        if (!appId)
            return null;
        return (React.createElement(ui.PanelSection, { title: "Steam Reviews" },
            React.createElement(ui.PanelSectionRow, null, loading ? (React.createElement("span", null, "Loading...")) : reviewScore ? (React.createElement("span", null,
                "\u2B50 ",
                reviewScore)) : (React.createElement("span", null, "No reviews available")))));
    };
    const GameDetailsReviewBadge = () => {
        const appId = window?.appDetailsStore?.currentGame?.appid ?? null;
        return React.createElement(ReviewScorePanel, { appId: appId });
    };
    var index = ui.definePlugin(() => ({
        name: "decky-steam-reviews",
        titleView: React.createElement("div", { className: ui.staticClasses.Title }, "Steam Reviews"),
        content: React.createElement(GameDetailsReviewBadge, null),
        icon: React.createElement("span", null, "\u2B50"),
        onDismount() { },
    }));

    return index;

})(DFL, DeckyPluginAPI, SP_REACT);
