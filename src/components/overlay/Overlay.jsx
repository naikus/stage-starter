/* global */
import {createSignal, createEffect, onMount, onCleanup, Show} from "solid-js";
import {Portal} from "solid-js/web";
import "./style.less";


const FOCUSABLE_ELEMS = "[tabindex], input, button, a, select, textarea, [contenteditable]";
/**
 * Guards the focus within the overlay
 */
const FocusGuard = (props) => {
  const focusFirstElem = () => {
        const contextElem = fcGuard,
            elems = contextElem.querySelectorAll(FOCUSABLE_ELEMS);
        if(elems.length) {
          elems[1].focus();
        }
      },
      focusLastElem = () => {
        if(shiftKey) {
          const contextElem = fcGuard,
              elems = contextElem.querySelectorAll(FOCUSABLE_ELEMS);
          if(elems.length > 1) {
            elems[elems.length - 2].focus();
          }
        }
      },
      shiftKeyListener = e => {
        if(e.key === "Tab" && e.shiftKey) {
          shiftKey = true;
        }else {
          shiftKey = false;
        }
      };
      
  let fcGuard, shiftKey;

  onMount(() => {
    document.addEventListener("keydown", shiftKeyListener);

    /**
     * @Note The FocusGuard component is a work in progress and may not work as expected in all cases.
     * It causes problems with the focus in some cases, e.g. when using bottom. Hence the timeout.
     * This should be ideally same as the animation duration in the style.less file.
     */
    setTimeout(() => {
      focusFirstElem(fcGuard);
    }, 300);
  });

  onCleanup(() => {
    document.removeEventListener("keydown", shiftKeyListener);
  });

  return (
    <div ref={fcGuard} class="focus-guard">
      <span class="fg-boundry" tabIndex={0} onFocus={focusLastElem} />
      {props.children}
      <span class="fg-boundry" tabIndex={0} onFocus={focusFirstElem} />
    </div>
  );
};

/**
 * Overlay comonent. Add the class "modal" to the overlay to make it a modal. Use the class
 * "bottom" to position the overlay at the bottom of the screen.
 * @param {{
 *   target: string,
 *   className: string?,
 *   onClose: function,
 *   children: any,
 *   show: boolean,
 * }} props
 */
function Overlay(props) {
  const [wasShown, setWasShown] = createSignal(false),
    [anim, setAnim] = createSignal(false),
    [mount, setMount] = createSignal(false),

    overlayCloseAnimHandler = e => {
      // console.log("Animation end", e);
      if(e.animationName === "overlay_close") {
        setMount(false);
        props.onClose && props.onClose();
      }
    };

  let overlayBackdropRef;

  // mount & unmount
  createEffect(function showOverlay() {
    if(props.show) {
      setMount(true);
      setAnim(true);
      setWasShown(true);
    }else {
      if(wasShown()) {
        setAnim(false);
      }
    }
  });

  return (
    <Show when={mount()} fallback={null}>
      <Portal mount={props.target ? document.querySelector(props.target) : document.body}>
        <FocusGuard>
          <div ref={overlayBackdropRef} 
              class={`overlay-backdrop ${anim() ? "__visible" : ""}`}
              on:animationend={overlayCloseAnimHandler}>
            <div class={`overlay ${props.class}`}>
              {props.children}
            </div>
          </div>
        </FocusGuard>
      </Portal>
    </Show>
  );
}
export default Overlay;
