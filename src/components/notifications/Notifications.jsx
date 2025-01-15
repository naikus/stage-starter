import {Match, Show, Switch, createEffect, createSignal, onCleanup, onMount} from "solid-js";
import {createStore, produce} from "solid-js/store";
import {Dynamic} from "solid-js/web";
import "./style.less";

/**
 * @typedef {"toast" | "info" | "success" | "warn" | "error"} NotificationType
 * @typedef {"bottom" | "top"} NotificationPosition
 */

/**
 * @typedef NotificationMessage
 * @property {NotificationType} type
 * @property {string | JSX.Element} content
 * @property {NotificationPosition} position
 * @property {number | boolean} autoDismiss
 * @property {() => void} onDismiss
 * @property {string} class
 */


const [
  /**
   * @type {NotificationMessage[]}
   */
  messages, 
  setMessages
] = createStore([]);


const DEFAULT_AUTO_DISMISS = 3500;

/**
 * @param {{
 *  class: string
 * }} props 
 */
function Notifications(props) {
  const [current, setCurrent] = createSignal(null);

  function next() {
    // This will trigger the effect to show the next notification
    setCurrent(null);
  }

  createEffect(() => {
    if(!current() && messages.length > 0) {
      const [first, ...rest] = messages;
      setCurrent(first);
      setMessages(rest);
    }
  });

  return (
    <div class={`notifications`}>
      <Show when={current()}>
        <Notification message={current()} onHide={next} />
      </Show>
    </div>
  );
}


/**
 * 
 * @param {{
 *  message: NotificationMessage
 *  onShow: () => void
 *  onHide: () => void
 * }} props 
 */
function Notification(props) {
  const [show, setShow] = createSignal(false);
  let mountTimeoutId, timeoutId;

  function dismiss() {
    setShow(false);
    clearTimeout(timeoutId);
  }

  function handleTransitionEnd(e) {
    if(e.propertyName !== "transform") {
      return;
    }
    if(!show()) {
      props.message.onDismiss && props.message.onDismiss();
      props.onHide && props.onHide();
    }else {
      props.onShow && props.onShow();
    }
  }

  onMount(() => {
    // Show the notification when mounted
    mountTimeoutId = setTimeout(() => {
      setShow(true);
    }, 30);

    // Auto dismiss the notification
    if(props.message.autoDismiss) {
      timeoutId = setTimeout(dismiss, props.message.autoDismiss);
    }
  });

  onCleanup(() => {
    mountTimeoutId && clearTimeout(mountTimeoutId);
    timeoutId && clearTimeout(timeoutId);
  });

  return (
    <div onTransitionEnd={handleTransitionEnd}
        class={
          `notification
          ${props.message.type || "toast"}
          ${props.message.position || "bottom"} 
          ${show() ? "show" : ""}`
        }
        onClick={dismiss}>
      <Switch>
        <Match when={typeof props.message.content === "string"}>
          {props.message.content}
        </Match>
        <Match when={typeof props.message.content === "function"}>
          <Dynamic component={props.message.content} />
        </Match>
      </Switch>
    </div>
  );
}
Notification.displayName = "Notification";


/**
 * Generic notification (toast)
 * @param {NotificationMessage} message 
 */
function notify(message) {
  setMessages(
    produce(allMessages => {
      // console.log(allMessages);
      allMessages.push(message);
    })
  );
}
notify.info = (content, autoDismiss = DEFAULT_AUTO_DISMISS) => {
  notify({
    type: "info",
    content,
    autoDismiss
  });
};
notify.success = (content, autoDismiss = DEFAULT_AUTO_DISMISS) => {
  notify({
    type: "success",
    content,
    autoDismiss
  });
};
notify.warn = (content, autoDismiss = DEFAULT_AUTO_DISMISS) => {
  notify({
    type: "warn",
    content,
    autoDismiss
  });
};
notify.error = (content, autoDismiss = DEFAULT_AUTO_DISMISS) => {
  notify({
    type: "error",
    content,
    autoDismiss
  });
};




export {
  Notifications,
  Notification,
  notify
};