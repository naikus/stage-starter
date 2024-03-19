// import Stage from "@naikus/stage";
import {render} from "solid-js/web";
import {createSignal} from "solid-js";

import "./style.less";

export default {
  id: "about",
  template: `<div class="stage-view no-actionbar about"></div>`,
  factory(appContext, viewUi, vconfig) {
    const goBack = _ => appContext.getRouter().back(),
        [viewOptions, setViewOptions] = createSignal({}),

        Content = function(props) {
          const {appName, appVersion, branding, logo} = appContext.getConfig();
          // setViewOptions(props.options);
          return (
            <div class="content text-center">
              <img width="130" height="130"
                class="logo"
                alt="logo"
                src={logo} />
              <h3>
                {appName} ({appVersion})
              </h3>
              <p>
                Made using <a target="_blank" href="https://naikus.github.io/stage">stagejs</a> and 
                <a target="_blank" href="https://solidjs.com">Solidjs</a>
              </p>
              <pre class="message" style={{
                "font-size": "0.8em"
              }}>
                View options: <br />
                {JSON.stringify(viewOptions(), null, 2)}

                <br />
                View config: <br />
                {JSON.stringify(vconfig, null, 2)}
              </pre>
              <button onClick={goBack} class="primary">Back</button>
            </div>
          );
        },

        handleTransitionOut = _ => {
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
