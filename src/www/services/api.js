const ApiClient = require("api-client"),
    Config = require("../config");

module.exports = ApiClient.create({
  apiUrl: Config.apiServerUrl + Config.apiBasePath
});
