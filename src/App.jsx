import {Show, createSignal, onCleanup, onMount} from "solid-js";
// import createRouter from "@lib/simple-router";
import createRouter from "simple-router";

import Stage from "@naikus/stage";
import "@node_modules/@naikus/stage/src/stage.less";

import Progress from "@components/progress/Progress";
import {addListener} from "@lib/event-utils";
import Config from "@config";

import "./style.less";

/**
 * @typedef {import("./routes").RouteConfig} RouteConfig
 * @typedef {import("./components/stage/Stage").ViewConfig} ViewConfig
 * @typedef {import("solid-js").JSXElement} JSXElement
 */


/**
 * 
 * @param {{
 *  visible: boolean
 *  children: JSXElement
 * }} props 
 */
function BottomBar(props) {
  return (
    <div className={"bottom-bar " + (props.visible ? "show" : "")}>
      {props.children}
    </div>
  );
}



/**
 * 
 * @param {{
 *  routes: RouteConfig[]
 *  transition: string
 * }} props 
 */
function App(props) {
  const noop = () => {},
      [isRouteLoading, setRouteLoading] = createSignal(false);

  let viewport,
      stageInstance,
      eventUnsubscribes,
      router,
      routerUnsubscribes;

  function stageContextFactory(stage, stageOpts) {
    return {
      getRouter() {
        return router;
      },
      pushView(viewId, options) {
        // @todo Check if view is allowed for the current user
        // console.log("[App]: Pushing view", viewId, options);
        // return stage.pushView(viewId, options);
        throw new Error("Use router.route()");
      },
      popView(options) {
        // @todo Check if view is allowed for the current user
        // return stage.popView(options);
        throw new Error("Use router.back()");
      },
      getViewConfig(viewId) {
        return stage.getViewConfig(viewId);
      },
      getConfig() {
        return Config
      }
    };
  }

  function setupStage() {
    const instance = Stage({
        viewport,
        transition: "slide",
        transitionDelay: 10,
        contextFactory: stageContextFactory
      }),

      eventUnsubscribes = [
        addListener(viewport, "viewloadstart", noop),
        addListener(viewport, "viewloadend", noop),
        addListener(viewport, "beforeviewtransitionin", noop),
        addListener(viewport, "beforeviewtransitionout", noop)
      ];

    return [instance, eventUnsubscribes];
  }

  function setupBackButton() {
    addListener(document, "backbutton", () => {

    });
  }

  function setupRouter() {
    const router = createRouter(props.routes, {
      defaultRoute: "/",
      errorRoute: "/~error"
    });

    const routerUnsubscribes = [
      router.on("before-route", (event, data) => {
        setRouteLoading(true);
      }),
      router.on("route", (event, context) => {
        setRouteLoading(false);
        const {route, view} = context,
            {state, action, params, handler} = route,
            viewContext = stageInstance.getViewContext(),
            currentView = stageInstance.currentView(),
            viewOptions = Object.assign({}, state, {params: params}),
            showView = (id, viewOptions, action) => {
              // console.debug("Show view", id, viewOptions, action);
              if((currentView === id) || action !== "POP") {
                stageInstance.pushView(id, viewOptions);
              }else {
                stageInstance.popView(viewOptions);  
              }
            };

        if(view) {
          const {id, viewDef, config} = view;
          if(!stageInstance.getViewDefinition(id)) {
            // Stage.view(id, null, config);
            Stage.defineView(viewDef, config);
          }
          showView(id, viewOptions, action);
        }else if(typeof handler === "function") {
          handler(context);
        }else {
          console.warn("No view or handler found for route", route);
        }
      }),
      router.on("route-error", (event, error) => {
        setRouteLoading(false);
        console.warn("Error loading route", error);
      })
    ];
    return [router, routerUnsubscribes];
  }

  onMount(() => {
    [stageInstance, eventUnsubscribes] = setupStage();
    [router, routerUnsubscribes] = setupRouter();
    router.start();
    router.route(router.getBrowserRoute() || "/");

    // console.log(stageComponent);
    addListener(document, "deviceready", () => {
      setupBackButton();
    });
  });

  onCleanup(() => {
    eventUnsubscribes.forEach(unsubscribe => unsubscribe());
    routerUnsubscribes.forEach(unsubscribe => unsubscribe());
  });

  return (
    <div className="app">
      <div ref={viewport} class="stage-viewport"></div>
      <Show when={isRouteLoading()}>
        <Progress className="route-progress" />
      </Show>
    </div>
  )
}

export default App;
