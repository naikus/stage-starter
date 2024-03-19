
import { createMemo, createSignal } from "solid-js";
import "./style.less";

/**
 * @param {{
 *  min: number
 *  max: number
 *  value: number
 *  className: string
 * }} props 
 * @returns 
 */
function Progress(props) {
  const percentValue = createMemo(() => {
      const min = props.min || 0,
          max = props.max || 100, 
          value = props.value, 
          numVal = Number(value),
          val = numVal + Math.abs(min),
          diff = max - min;
      return val * 100 / diff;
    }),
    indeterminate = createMemo(() => {
      return isNaN(percentValue());
    });

  return (
    <div class={`progress ${indeterminate() ? "indeterminate" : ""} ${props.class || ""}`}>
      <div class="progress-track" style={{
        width: `${indeterminate() ? 20 : percentValue()}%`
      }} />
    </div>
  );
}
Progress.displayName = "Progress";

export default Progress;