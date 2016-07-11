var Redux = require("redux"),
    Stage = require("stage"),
    AppStage;


Stage.views({
  "dashboard": "modules/dashboard/index.html",
  "about": "modules/about/index.html"
});

AppStage = Stage({
  viewport: "#viewPort"
});

setTimeout(function() {
  AppStage.pushView("dashboard");
}, 1000);

module.exports = AppStage;
