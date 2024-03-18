// Brand directory is set at build time. See vite.config.js -> alias for how this works!
import BrandConfig from  "@branding/index.js";
import {version} from "../package.json";

/**
 * @typedef AppConfig
 * @property {string} appName The application name
 * @property {string} appVersion The application version (usually package.json version)
 * @property {string} appNs The application namespacea (used for local storage)
 * @property {string} apiServerUrl The url of the API server if any
 * @property {string} branding The branding directory name
 */

/**
 * @type {AppConfig}
 */
const config = {
  appName: import.meta.env.APP_NAME || "Stage Starter",
  appVersion: version,
  appNs: import.meta.env.APP_NS || "stagestarter",
  apiServerUrl: import.meta.env.APP_API_SERVER_URL,
  branding: import.meta.env.APP_BRANDING,
  ...BrandConfig
};

export default config;