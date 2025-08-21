// import Stage from "@naikus/stage";
import {For, Show, createSignal, onMount, onCleanup} from "solid-js";
import {render} from "solid-js/web";
import {notify} from "@components/notifications/Notifications";

import Items from "./items";
import "./style.less";

export default{
  id: "main",
  template: `<div class="stage-view main"></div>`,
  factory(appContext, viewUi, viewConfig) {
    const router = appContext.getRouter(),
        transitions = [
          "slide", "slide-fade",
          "fade", "fancy", "lollipop", "slide-fase",
          "slide-up", "slide-down", "pop-out", "slide-fade"
        ],
        randomTransition = () => {
          return transitions[Math.floor(Math.random() * transitions.length)];
          // return "slide-fade";
        },
        showAbout = () => router.route("/about", {transition: randomTransition()}),
        config = appContext.getConfig(),

        toggleScheme = () => {
          const root = document.firstElementChild,
              data = root.dataset,
              theme = data.theme;
          if(theme === "light") {
            data.theme = "dark";
          }else {
            data.theme = "light";
          }
        },

        showNotification = (type) => {
          notify({
            type: type,
            position: "bottom",
            content: `This is a example of notification/toast of type ${type}.`,
            autoDismiss: 4000
            // onDismiss: () => console.log("Notification dismissed")
          });
        },

        Content = function(props) {
          return (
            <div class="content">
              <p class="message" onClick={toggleScheme}>
                Welcome to {config.appName} v{config.appVersion}.
                Click the logo to go to the about page. (A random page transition is chosen).
              </p>
              <div class="main-logo anim">
                <img width="120" height="120"
                  class="spin-"
                  style={{
                    "-webkit-tap-highlight-color": "transparent"
                  }}
                  alt="Spinning Logo" 
                  onClick={showAbout}
                  src={config.logo} />
              </div>
              <ul class="items">
                <For each={Items}>
                  {item => (
                    <li onClick={[showNotification, item.type]}>
                      <span class="title">{item.name}</span>
                      <span class="type">{item.type}</span>
                    </li>
                  )}
                </For>
              </ul>
              <Show when={currentRoute() !== "/handler"}>
                <p class="block">
                  <a class="button primary" href="#/handler">Invoke route handler</a>
                </p>
              </Show>
            </div>
          );
        },
        
        exitApp = () => {
          if(navigator.app) {
            navigator.app.exitApp();
          }else {
            // closeExitOverlay();
          }
        },

        renderContent = (viewOpts, done) => {
          if(dispose) {
            dispose();
          }
          // render(<Content options={viewOpts} />, viewUi, done, {});
          dispose = render(() => <Content options={viewOpts} />, viewUi);
          done && done();
        },

        handleTransitionOut = () => {
          dispose && dispose();
        };

    const [currentRoute, setCurrRoute] = createSignal(router.getCurrentRoute().runtimePath);
    let dispose, routerSub;

    return {
      // Stage app lifecycle functions.
      initialize(viewOpts) {
        // viewUi.addEventListener("transitionout", handleTransitionOut);
        console.info(viewOpts);
        routerSub = router.on("route", ({route}) => {
          console.log("Setting current route", route.runtimePath);
          setCurrRoute(route.path);
        });
      },
      onBackButton() {
        exitApp();
      },
      activate(viewOpts, done) {
        renderContent(viewOpts, done);
      },
      update(viewOpts) {
        const {params} = viewOpts, {action} = params;
        notify({
          type: action ? "info" : "warn",
          position: "top",
          content: () => (
            <pre class="text-small">
              View updated with params: <br />
              {JSON.stringify(params)}
            </pre>
          ),
          autoDismiss: false
          // onDismiss: () => console.log("Notification dismissed")
        });
      },
      deactivate(viewOpts) {},
      destroy() {
        routerSub && routerSub();
      }
    };
  }
};
