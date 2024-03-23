// import Stage from "@naikus/stage";
import {For} from "solid-js";
import {render} from "solid-js/web";
import {notify} from "@components/notifications/Notifications";

import Items from "./items";
import "./style.less";

export default{
  id: "main",
  template: `<div class="stage-view main"></div>`,
  factory(appContext, viewUi, viewConfig) {
    const router = appContext.getRouter(),
        showAbout = () => router.route("/about"/*,{transition: "slide-up"}*/),
        config = appContext.getConfig(),

        notificationTypes = ["info", "toast", "success", "error", "warn"],
        positions = ["top", "bottom"],
        showNotification = () => {
          const type = Math.floor(Math.random() * notificationTypes.length),
              pos = Math.floor(Math.random() * positions.length);
          notify({
            type: notificationTypes[type],
            position: positions[pos],
            content: `This is a example of notification of type ${notificationTypes[type]}`,
            autoDismiss: Math.round(Math.random()) * 1500,
            onDismiss: () => console.log("Notification dismissed")
          });
        },

        Content = function(props) {
          return (
            <div class="content">
              <p class="message" onClick={showNotification}>
                Welcome to {config.appName} v{config.appVersion}.
                Click on the logo to go to the about page.
              </p>
              <div class="main-logo anim">
                <img width="200" height="200"
                  class="spin"
                  alt="Spinning Logo" 
                  onClick={showAbout}
                  src={config.logo} />
              </div>
              <ul class="items">
                <For each={Items}>
                  {item => <li>{item.name}</li>}
                </For>
              </ul>
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
          // render(<Content options={viewOpts} />, viewUi, done, {});
          dispose = render(() => <Content options={viewOpts} />, viewUi);
          done();
        },

        handleTransitionOut = () => {
          dispose && dispose();
        };

    let dispose;

    return {
      // Stage app lifecycle functions.
      initialize(viewOpts) {
        viewUi.addEventListener("transitionout", handleTransitionOut);
      },
      onBackButton() {
        exitApp();
      },
      activate(viewOpts, done) {
        renderContent(viewOpts, done);
      },
      update(viewOpts) {
        renderContent(viewOpts);
      },
      deactivate(viewOpts) {},
      destroy() {}
    };
  }
};
