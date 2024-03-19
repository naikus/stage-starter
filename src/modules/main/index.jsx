/* global Image */
// import Stage from "@naikus/stage";
import {createSignal, For} from "solid-js";
import {render} from "solid-js/web";
import Items from "./items";
import "./style.less";

export default{
  id: "main",
  template: `<div class="stage-view main"></div>`,
  factory(appContext, viewUi, viewConfig) {
    const router = appContext.getRouter(),
        showSettings = e => router.route("/about", {transition: "slide"}),
        config = appContext.getConfig(),

        Content = function(props) {
          return (
            <div className="content">
              <p className="message">
                Welcome to {config.appName} v{config.appVersion}.
                Click on the logo to go to the about page.
              </p>
              <div className="main-logo anim">
                <img width="200" height="200"
                  className="spin"
                  alt="Spinning Logo" 
                  onClick={showSettings}
                  src={config.logo} />
              </div>
              <ul className="items">
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
            closeExitOverlay();
          }
        },

        renderContent = (viewOpts, done, context = {}) => {
          // render(<Content options={viewOpts} />, viewUi, done, {});
          dispose = render(() => <Content options={viewOpts} />, viewUi);
          done();
        },

        handleTransitionOut = _ => {
          dispose && dispose();
        };

    let dispose;

    return {
      // Stage app lifecycle functions.
      initialize(viewOpts) {
        viewUi.addEventListener("transitionout", handleTransitionOut);
      },
      onBackButton() {
        
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
