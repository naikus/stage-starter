// import Stage from "@naikus/stage";
import {render} from "solid-js/web";
import {createSignal} from "solid-js";
import Overlay from "@components/overlay/Overlay";

import "./style.less";

export default {
  id: "about",
  template: `<div class="stage-view no-actionbar about"></div>`,
  factory(appContext, viewUi, viewConfig) {
    const goBack = _ => appContext.getRouter().back(),
        [viewOptions, setViewOptions] = createSignal({}),
        Content = function(props) {
          const {appName, appVersion, branding, logo} = appContext.getConfig(),
              [show, setShow] = createSignal(false),
              toggleOverlay = _ => setShow(!show());

          return (
            <div class="content text-center">
              <img width="80" height="80"
                class="logo"
                alt="logo"
                onClick={toggleOverlay}
                src={logo} />
              <h3>
                {appName} ({appVersion})
              </h3>
              <p>
                Made using <a target="_blank" href="https://naikus.github.io/stage">stagejs</a> and 
                <a target="_blank" href="https://solidjs.com">Solidjs</a>
              </p>
              <div id="about-message" class="message" style={{
                  "font-size": "0.75em",
                  "font-family": "monospace"
                }}>
                View options:
                <pre>
                  {JSON.stringify(viewOptions(), null, 2)}
                </pre>
                <br />
                View config:
                <pre>
                  {JSON.stringify(viewConfig, null, 2)}
                </pre>
              </div>
              <div class="actions">
                <button onClick={goBack} class="primary">Back</button>
              </div>
              <Overlay show={show()} class="bottom modal alert"
                  target={Math.round(Math.random()) ? "body" : "#about-message"}>
                <div class="title">
                  <h4 class="title">Overlay</h4>
                </div>
                <div style={{"text-wrap": "pretty"}} class="content alert-content">
                  Example of an overlay. It can be shown on top of the current view or any other 
                  element and also has a focus guard.
                </div>
                <div class="actions">
                  <button>Dummy</button>
                  <button onClick={toggleOverlay} class="primary">Close</button>
                </div>
              </Overlay>
            </div>
          );
        },

        handleTransitionOut = _ => {
          // console.log(_);
          dispose && dispose();
        };

    let dispose;
    return {
      initialize(viewOpts) {
        viewUi.addEventListener("transitionout", handleTransitionOut);
      },
      activate(viewOpts, done) {
        setViewOptions(viewOpts);
        dispose = render(() => <Content />, viewUi);
        done();
      },

      deactivate() {
      }
    };
  }
};
