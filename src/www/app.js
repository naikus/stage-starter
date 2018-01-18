/* global require module */
const Stage = require("stage"),
    Activables = require("activables"),
    Routes = require("./routes"),
    Config = require("./config"),
    Store = require("store2").namespace(Config.appnamespace),
    AppStage = Stage({
      viewport: "#viewPort",
      transition: "lollipop"
    });


/**
 * Sets up the back button on cordova
 * @param {Stage} AppStage The Stage instance
 */
function setupBackButton(AppStage) {
  document.addEventListener("backbutton", e => {
    const controller = AppStage.getViewController(AppStage.currentView());
    if(typeof controller.onBackButton === "function") {
      controller.onBackButton();
    }else {
      try {
        AppStage.popView();
      }catch(e) {
        navigator.app.exitApp();
      }
    }
  }, false);
}

/**
 * Run the application with specified view
 * @param {String} viewName The name of the starting view
 */
function run(viewName) {
  const viewPort = AppStage.getViewPort(), activables = Activables(document);

  // Register all the routes
  Object.keys(Routes).forEach(r => {
    const viewInfo = Routes[r];
    Stage.view(viewInfo.view, viewInfo.templateUrl);
  });


  // Start the activables
  activables.start();
  window.addEventListener("unload", event => {
    activables.stop();
  });


  viewPort.addEventListener("viewloadstart", e => {}, false);
  viewPort.addEventListener("viewloadend", e => {}, false);
  setupBackButton(AppStage);

  AppStage.pushView(viewName);
}



module.exports = {
  run: run,
  Store: Store
};
