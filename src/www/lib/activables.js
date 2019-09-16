/* global require module setTimeout clearTimeout */
const {hasClass, addClass, removeClass} = require("clazz"),
    defaults = {
      level: 4,
      delay: 100,
      targetClass: "activable",
      activeClass: "active"
    };

let touchstart = "touchstart", touchend = "touchend", touchmove = "touchmove";
if(!("ontouchstart" in document.documentElement)) {
  touchstart = "mousedown";
  touchmove = "mousemove";
  touchend = "mouseup";
}

/**
 * Shallow copies properties from sources to target
 * @return {Object} newly created copy
 */
function shallowCopy(...args) {
  let target = args[0], sources = Array.prototype.slice.call(args, 1), src;
  for(let i = 0, len = sources.length; i < len; i++) {
    src = sources[i];
    for(let k in src) {
      if(src.hasOwnProperty(k)) {
        target[k] = src[k];
      }
    }
  }
  return target;
}


/**
 * Creates a new Activables for specified container. The activables object with start and stop
 * will  start listening to touch events and add/remove 'active' class on touch start and end
 * @param {Element | Document} container To which to attach activables
 * @param {Object} opts
 * @return {Activables} An activables object with start and stop function
 */
function Activables(container, opts) {
  let options = shallowCopy({}, defaults, (opts || {})),
      level = options.level,
      delay = options.delay,
      activeClass = options.activeClass,
      targetClass = options.targetClass,
      timer,
      element;

  const activate = () => {
        addClass(element, activeClass);
      },

      deactivate = () => {
        if(!element) return;
        container.removeEventListener(touchmove, move, false);
        removeClass(element, activeClass);
        element = null;
      },

      start = e => {
        if(element) return;
        let target = e.target, lvl = level;
        while(target && lvl--) {
          if(hasClass(target, targetClass)) {
            element = target;
            break;
          }else {
            target = target.parentNode;
          }
        }

        if(!element) return;
        // console.log("adding listener");
        container.addEventListener(touchmove, move, false);
        // start the timer
        // timer = setTimeout(activate, delay);
        activate();
      },

      end = e => {
        if(element) {
          clearTimeout(timer);

          if(hasClass(element, activeClass)) {
            setTimeout(deactivate, delay);
          }else {
            addClass(element, activeClass);
            setTimeout(deactivate, delay);
          }
        }
      },

      move = e => {
        // console.log("move...");
        if(element) {
          // console.log("moved!! de-activating...");
          clearTimeout(timer);
          deactivate();
        }
      };

  return {
    start() {
      container.addEventListener(touchstart, start, false);
      container.addEventListener(touchend, end, false);
    },
    stop() {
      container.removeEventListener(touchstart, start, false);
      container.removeEventListener(touchend, end, false);
    }
  };
}

module.exports = Activables;
