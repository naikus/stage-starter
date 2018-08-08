/* global */
module.exports = {
  appnamespace: "starterapp",
  apiServerUrl: "https://api.starterapp.com",
  apiBasePath: "/api",
  // baseDir: "app",


  views: {
    "/sell": {
      view: "sell",
      template: "modules/sell/view.js"
    },
    "/auth": {
      view: "auth",
      template: "modules/auth/view.js"
    }
  }
};
