/* @refresh reload */
import {render} from "solid-js/web";
import Config from "@config";
import App from "./App";
import routes from "./routes";

(() => {
  document.getElementById("favicon").href = Config.favicon;
  document.title = Config.appName;
})();


render(
  () => (
    <App routes={routes} />
  ), 
  document.getElementById("root")
);

// Remove the loading screen
setTimeout(() => {
  const loading = document.getElementById("loading");
  // loading && loading.remove();
  if(loading) {
    // loading.querySelector(".loading-msg").innerText = "DONE";
    loading.remove();
  }
}, 100);