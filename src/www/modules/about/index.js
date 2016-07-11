var Stage = require("stage");

Stage.defineView("about", function(AppStage, viewUi) {
  return {
    initialize: function() {
      viewUi.addEventListener("click", function() {
        AppStage.popView();
      }, false);
    },
    activate: function() {}
  };
});
