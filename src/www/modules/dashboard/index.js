var Stage = require("stage");

Stage.defineView("dashboard", function(AppStage, viewUi) {
  return {
    initialize: function() {
      viewUi.getElementsByClassName("content")[0].innerHTML = "<h2>Hello From Dashboard</h2>";
      viewUi.addEventListener("click", function() {
        AppStage.pushView("about", {
          transition: {
            name: "lollipop",
            property: "transform"
          }
        });
      }, false);
    },
    activate: function() {
    }
  };
});
