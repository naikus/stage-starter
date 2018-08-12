/* global */
const {createComponent, mount} = require("vidom"),
    Stage = require("stage"),
    Config = require("./config"),
    // Router = require("simple-router").default,
    Storage = require("store2").namespace(Config.appnamespace),
    Activables = require("activables"),

    Sidebar = createComponent({
      onInit() {},
      onMount() {},
      onRender() {
        return (
          <div class={"sidebar"}>
          </div>
        );
      }
    }),

    Messages = createComponent({
      onInit() {},
      onMount() {},
      onRender() {
        return (
          <div class={"messages"}>
          </div>
        );
      }
    }),

    LoadingIndicator = createComponent({
      displayName: "LoadingIndicator",
      onRender() {
        return (
          <div className="loading-indicator">
            <div className="slider"></div>
          </div>
        );
      }
    }),

    App = createComponent({
      setupStage() {
        const {viewportElem} = this,
            {startView = "main", transition = "lollipop"} = this.attrs,
            // router = Router.create(),
            viewConfig = Config.views,
            stage = this.stage = Stage({
              transitionDelay: 50,
              viewport: viewportElem,
              transition: transition || "lollipop"
            });

        viewportElem.addEventListener("beforeviewtransitionin", e => {
          const viewId = e.viewId,
              controller = this.stage.getViewController(viewId),
              ViewActionBar = typeof controller.getActionBar === "function" ?
                controller.getActionBar() : null;
          // console.log("View actionbar", ViewActionBar);
          this.setState({ViewActionBar: ViewActionBar});
        });
        // /*
        viewportElem.addEventListener("viewloadstart", e => {
          // const {viewId, error} = e;
          this.setState({loading: true});
        });
        viewportElem.addEventListener("viewloadend", e => {
          const {viewId, error} = e;
          this.setState({loading: false});
          console.log(e);
        });
        // */
        /*
        viewportElem.addEventListener("beforeviewtransitionout", e => {
          const {viewId} = e;
          console.log(e);
        });
        */
        // Register all the routes
        Object.keys(viewConfig).forEach(path => {
          const viewInfo = viewConfig[path], view = viewInfo.view;
          Stage.view(view, viewInfo.template);
        });
        stage.pushView(startView, {});
      },
      setupBackButton() {
        document.addEventListener("backbutton", e => {
          const {stage} = this, controller = stage.getViewController(stage.currentView());
          if(typeof controller.onBackButton === "function") {
            controller.onBackButton();
          }else {
            try {
              stage.popView();
            }catch(e) {
              navigator.app.exitApp();
            }
          }
        }, false);
      },
      // Lifecycle methods
      onInit() {
        this.setState({
          ViewActionBar: null,
          loading: false
        });
      },
      onMount() {
        this.setupStage();
        this.setupBackButton();
      },
      onRender() {
        const {ViewActionBar, loading, showSidebar, messages} = this.state;
        return (
          <fragment>
            <div ref={el => this.viewportElem = el} class="stage-viewport"></div>
            <div class={"actionbar-container" + (ViewActionBar ? " show" : "")}>
              {ViewActionBar ? <ViewActionBar /> : null}
            </div>
            {showSidebar ? <Sidebar /> : null}
            {messages ? <Messages items={messages} /> : null}
            {loading ? <LoadingIndicator /> : null}
          </fragment>
        );
      }
    });

// Register custom events (lib/touch.js)
// require("touch");


/**
 * Run the app
 */
function run() {
  const activables = Activables(document);
  // Start the activables
  activables.start();
  window.addEventListener("unload", event => {
    activables.stop();
  });
  const auth = Storage.get("auth"),
      startView = (auth && auth.accountId && auth.apiKey) ? "sell" : "auth";

  mount(document.getElementById("shell"), <App startView={startView} transition="slide" />);
}


// Register the service worker
/*
if("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(
      registration => {
        console.log("Service worker registration success", registration);
      },
      error => {
        console.log("Service worker registration failed", error);
      }
    );
  });
}
*/

module.exports = {
  run: run,
  Storage,
  Config
};
