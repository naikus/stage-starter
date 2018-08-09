/* global */
module.exports = {
  appnamespace: "slickposapp",
  apiServerUrl: "https://api.slickpos.com",
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
