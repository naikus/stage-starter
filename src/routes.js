import {notify} from "@components/notifications/Notifications";

/**
 * @typedef {import("simple-router/src/types").RouteDefn} RouteDefn
 */

/**
 * @type {RouteDefn[]}
 */
export default [
  {
    path: "/",
    controller() {
      return {
        // forwards are handled by the router itself
        forward: "/main"
      };
    }
  },
  {
    path: "/main{/:action}",
    controller(context) {
      // console.log(context.route);
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
    controller(context) {
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
    controller(context) {
      return {
        handler() {
          console.log("Handler route", context);
          notify.info(`Handling route ${context.route.runtimePath}`);
        }
      };
    }
  }
];
