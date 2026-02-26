(function (ui, api, React$1) {
  'use strict';

  var DefaultContext = {
    color: undefined,
    size: undefined,
    className: undefined,
    style: undefined,
    attr: undefined
  };
  var IconContext = React$1.createContext && React$1.createContext(DefaultContext);

  var __assign = undefined && undefined.__assign || function () {
    __assign = Object.assign || function (t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  };
  function Tree2Element(tree) {
    return tree && tree.map(function (node, i) {
      return React$1.createElement(node.tag, __assign({
        key: i
      }, node.attr), Tree2Element(node.child));
    });
  }
  function GenIcon(data) {
    // eslint-disable-next-line react/display-name
    return function (props) {
      return React$1.createElement(IconBase, __assign({
        attr: __assign({}, data.attr)
      }, props), Tree2Element(data.child));
    };
  }
  function IconBase(props) {
    var elem = function (conf) {
      var attr = props.attr,
        size = props.size,
        title = props.title,
        svgProps = __rest(props, ["attr", "size", "title"]);
      var computedSize = size || conf.size || "1em";
      var className;
      if (conf.className) className = conf.className;
      if (props.className) className = (className ? className + " " : "") + props.className;
      return React$1.createElement("svg", __assign({
        stroke: "currentColor",
        fill: "currentColor",
        strokeWidth: "0"
      }, conf.attr, attr, svgProps, {
        className: className,
        style: __assign(__assign({
          color: props.color || conf.color
        }, conf.style), props.style),
        height: computedSize,
        width: computedSize,
        xmlns: "http://www.w3.org/2000/svg"
      }), title && React$1.createElement("title", null, title), props.children);
    };
    return IconContext !== undefined ? React$1.createElement(IconContext.Consumer, null, function (conf) {
      return elem(conf);
    }) : elem(DefaultContext);
  }

  // THIS FILE IS AUTO GENERATED
  function FaStar (props) {
    return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"}}]})(props);
  }

  // Liaison vers la méthode Python get_review_score
  const getReviewScore = api.callable("get_review_score");
  /**
   * Composant principal affiché dans le panneau latéral du jeu.
   * Récupère et affiche le score d'évaluation Steam du jeu actif.
   */
  const ReviewScorePanel = ({ appId }) => {
      const [reviewScore, setReviewScore] = React$1.useState(null);
      const [loading, setLoading] = React$1.useState(false);
      React$1.useEffect(() => {
          setReviewScore(null);
          // Jeux non-Steam ou absence d'app_id : on n'affiche rien
          if (!appId || appId === 0)
              return;
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
      if (!appId)
          return null;
      return (React.createElement(ui.PanelSection, { title: "Steam Reviews" },
          React.createElement(ui.PanelSectionRow, null, loading ? (React.createElement("span", { style: { opacity: 0.6, fontSize: "0.85em" } }, "Loading\u2026")) : reviewScore ? (React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } },
              React.createElement(FaStar, { style: { color: "#c6d4df", flexShrink: 0 } }),
              React.createElement("span", { style: { fontSize: "0.9em", fontWeight: 500 } }, reviewScore))) : (React.createElement("span", { style: { opacity: 0.5, fontSize: "0.85em" } }, "No reviews available")))));
  };
  /**
   * Composant injecté dans la page de détails d'un jeu de la bibliothèque Steam.
   */
  const GameDetailsReviewBadge = () => {
      const appId = window?.appDetailsStore?.currentGame?.appid ?? null;
      return React.createElement(ReviewScorePanel, { appId: appId });
  };
  /**
   * Point d'entrée du plugin.
   */
  var index = ui.definePlugin(() => {
      return {
          name: "decky-steam-reviews",
          titleView: React.createElement("div", { className: ui.staticClasses.Title }, "Steam Reviews"),
          content: React.createElement(GameDetailsReviewBadge, null),
          icon: React.createElement(FaStar, null),
          onDismount() { },
      };
  });

  return index;

})(DFL, DeckyPluginAPI, SP_REACT);
