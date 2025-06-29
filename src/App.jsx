import {Show, createSignal, onCleanup, onMount} from "solid-js";
import createRouter from "simple-router";

import Stage from "@naikus/stage";
import "@node_modules/@naikus/stage/src/stage.less";

import {Notifications, notify} from "@components/notifications/Notifications";
import Progress from "@components/progress/Progress";
import {addListener} from "@lib/event-utils";
import Config from "@config";

import "./style.less";

/**
 * @typedef {import("simple-router/src/types").Router} Router
 * @typedef {import("simple-router/src/types").RouteInfo} RouteInfo
 * @typedef {import("simple-router/src/types").create} createRouter 
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
    <div class={"bottom-bar " + (props.visible ? "show" : "")}>
      {props.children}
    </div>
  );
}



/**
 * 
 * @param {{
 *  routes: RouteDefn[]
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
      routerUnsubscribers;

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
        return Config;
      }
    };
  }

  function setupStage() {
    const instance = Stage({
        viewport,
        // available transitions: slide, fade, fancy, lollipop, slide-up, slide-down, pop-out
        transition: props.transition || "lollipop",
        transitionDelay: 100,
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

    const routerSubs = [
      router.on("before-route", (data) => {
        setRouteLoading(true);
      }),
      router.on("route", (context) => {
        // console.log("Route Event", context);
        setRouteLoading(false);
        const {route, view, handler} = context,
            {state, action, params} = route,
            // viewContext = stageInstance.getViewContext(),
            currentView = stageInstance.currentView(),
            viewOptions = Object.assign({}, state, {params: params});

        if(view) {
          const {id, viewDef, config} = view;
          if(!stageInstance.getViewDefinition(id)) {
            // Stage.view(id, null, config);
            Stage.defineView(viewDef, config);
          }
          // showView(id, viewOptions, action);
          // console.debug("Show view", id, viewOptions, action);
          if((currentView === id) || action !== "POP") {
            stageInstance.pushView(id, viewOptions);
          }else {
            stageInstance.popView(viewOptions);  
          }
        }else if(typeof handler === "function") {
          handler();
        }else {
          console.warn("No view or handler found for route", route);
        }
      }),
      router.on("route-error", (error) => {
        setRouteLoading(false);
        // console.warn("Error loading route", error);
        notify({
          type: "error",
          content: () => (
            <span>
              Error loading route: {error.message} <a href="#/">Home</a>
            </span>
          ),
          autoDismiss: false
        });
      })
    ];
    return [router, routerSubs];
  }

  onMount(() => {
    [router, routerUnsubscribers] = setupRouter();
    [stageInstance, eventUnsubscribes] = setupStage();
    router.start();
    // window.router = router;
    router.route(router.getBrowserRoute() || "/");

    // console.log(stageComponent);
    addListener(document, "deviceready", () => {
      setupBackButton();
    });

    /*
    // Set theme based on system preference
    if(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.firstElementChild.dataset.theme = "dark";
    }else {
      document.firstElementChild.dataset.theme = "light";
    }
    */

  });

  onCleanup(() => {
    eventUnsubscribes && eventUnsubscribes.forEach(unsub => unsub());
    routerUnsubscribers && routerUnsubscribers.forEach(unsub => unsub());
  });

  return (
    <div class="app">
      <div ref={viewport} class="stage-viewport" />
      <Show when={isRouteLoading()}>
        <Progress class="route-progress" />
      </Show>
      <Notifications />
    </div>
  );
}

export default App;
