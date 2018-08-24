/* global setTimeout, clearTimeout */
const {createComponent, mount} = require("vidom"),
    Stage = require("stage"),
    Config = require("./config"),
    // Router = require("simple-router").default,
    Storage = require("store2").namespace(Config.appnamespace),

    Touchable = require("touchable"),
    Activables = require("activables"),

    Sidebar = createComponent({
      displayName: "Sidebar",
      setVisible(show) {
        clearTimeout(this.timeoutId);
        if(show) {
          this.setPanelVisible();
          this.timeoutId = setTimeout(this.showSidebar.bind(this), 100);
        }else {
          this.setPanelVisible();
          this.timeoutId = setTimeout(this.hide.bind(this), 350);
        }
      },
      setPanelVisible() {
        this.setState({
          stage: ["active"]
        });
      },
      showSidebar() {
        this.setState({
          stage: ["active", "show"]
        });
      },
      hide() {
        this.setState({
          stage: []
        });
      },
      sidebarAction(e) {
        console.log(e);
        const {onEmptyAction} = this.attrs;
        if(onEmptyAction) {
          onEmptyAction();
        }
      },

      onInit() {
        this.hide();
      },

      onChange(prevAttrs, prevChildren, prevState) {
        const {active} = this.attrs, prevActive = prevAttrs.active;
        if(active && !prevActive) {
          this.setVisible(true);
        }else if(!active && prevActive) {
          this.setVisible(false);
        }
      },

      onRender() {
        const {stage} = this.state;
        return (
          <div class={"sidebar-container " + stage.join(" ")}>
            <Touchable action="tap" onAction={this.sidebarAction.bind(this)}>
              <div class="sidebar-pane"></div>
            </Touchable>
            <div class="sidebar">
              {this.children}
            </div>
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
              transition: transition || "lollipop",
              context: {
                application: {
                  showSidebar: bShow => {
                    this.setSidebarVisible(bShow);
                  }
                }
              }
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
          // console.log(e);
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
      toggleSidebar() {
        this.setState({showSidebar: !this.state.showSidebar});
      },
      setSidebarVisible(bVisible) {
        this.setState({showSidebar: bVisible});
      },
      navigateTo(view) {
        this.toggleSidebar();
        setTimeout(_ => {
          this.stage.pushView(view, {});
        }, 300);
      },
      renderMenuItems() {
        return [
          {view: "main", title: "Home"},
          {view: "settings", title: "Settings"},
          {view: "about", title: "About"}
        ].map(item => {
          const {view, title} = item;
          return (
            <Touchable action="tap" onAction={this.navigateTo.bind(this, view)}>
              <li class="activable">{title}</li>
            </Touchable>
          );
        });
      },

      // Lifecycle methods
      onInit() {
        this.setState({
          ViewActionBar: null,
          loading: false,
          showSidebar: false
        });
      },
      onMount() {
        this.setupStage();
        this.setupBackButton();
      },
      onRender() {
        const {ViewActionBar, loading, showSidebar} = this.state;
        return (
          <fragment>
            <div ref={el => this.viewportElem = el} class="stage-viewport"></div>
            <div class={"actionbar-container" + (ViewActionBar ? " show" : "")}>
              {ViewActionBar ? <ViewActionBar /> : null}
            </div>
            <Sidebar active={showSidebar} onEmptyAction={this.toggleSidebar.bind(this)}>
              <Touchable action="tap" onAction={this.toggleSidebar.bind(this)}>
                <div class="branding">
                </div>
              </Touchable>
              <ul class="menu">
                {this.renderMenuItems()}
              </ul>
            </Sidebar>
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
  const settings = Storage.get("settings"),
      startView = settings ? "main" : "settings";

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
