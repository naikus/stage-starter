// import Stage from "@naikus/stage";
import {For} from "solid-js";
import {render} from "solid-js/web";

import Items from "./items";
import "./style.less";

export default{
  id: "main",
  template: `<div class="stage-view main"></div>`,
  factory(appContext, viewUi, viewConfig) {
    const router = appContext.getRouter(),
        showAbout = () => router.route("/about"/*,{transition: "slide-up"}*/),
        config = appContext.getConfig(),

        Content = function(props) {
          return (
            <div class="content">
              <p class="message">
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
