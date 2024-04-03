import {notify} from "@components/notifications/Notifications";

/**
 * @typedef {import("./components/stage/Stage").ViewConfig} ViewConfig
 */

/**
 * @typedef RouteConfig
 * @property {string} path The route path
 * @property {(context) => ViewConfig} controller The (optional) route controller
 * @property {ViewConfig} view The view config
 */

/**
 * @type {RouteConfig[]}
 */
export default [
  {
    path: "/",
    controller() {
      return {
        forward: "/main"
      };
    }
  },
  {
    path: "/main/:action?",
    controller () {
      return import("./modules/main/index").then(viewDef => {
        return {
          view: {
            id: "main",
            viewDef: viewDef.default || viewDef,
            config: {}
          }
        };
      });
    }
  },
  {
    path: "/about",
    controller () {
      return import("./modules/about/index").then(viewDef => {
        return {
          view: {
            id: "about",
            viewDef: viewDef.default || viewDef,
            config: {
              actionBar: false
            }
          }
        };
      });
    }
  },
  {
    path: "/handler",
    controller () {
      return {
        handler(context) {
          // console.log("Handler route", context);
          notify.info(`Handling route ${context.route.runtimePath}`);
        }
      };
    }
  }

  // This will generate a error notification as the view does not exist
  /*
  {
    path: "/foo",
    view: {
      id: "foo",
      src: "views/foo/index.js"
    }
  },
  */
];
