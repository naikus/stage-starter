/* @refresh reload */
import {render} from "solid-js/web";
import Config from "@config";
import App from "./App";
import routes from "./routes";

(() => {
  document.getElementById("favicon").href = Config.favicon;
  document.title = Config.appName;
})();


const dispose = render(() => (
    <App routes={routes} />
  ), 
  document.getElementById("root")
);

// Remove the loading screen
const loading = document.getElementById("loading");
loading && loading.remove();