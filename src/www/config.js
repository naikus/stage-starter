module.exports = {
  appnamespace: "starterapp",
  apiServerUrl: "",
  apiBasePath: "/api",
  // baseDir: "app",

  views: {
    "/main": {
      view: "main",
      template: "modules/main/view.js"
    },
    "/settings": {
      view: "settings",
      template: "modules/settings/view.js"
    },
    "/about": {
      view: "about",
      template: "modules/about/view.js"
    }
  }
};
