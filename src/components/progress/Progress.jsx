
import "./style.less";

const calculatePercentage = (value, min = 0, max = 0) => {
  const val = value + Math.abs(min),
      diff = max - min;
  return val * 100 / diff;
}

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
  const min = props.min || 0,
      max = props.max || 100, 
      value = props.value, 
      className = props.className || "",
      val = Number(value),
      indeterminate = isNaN(val),
      style = {
        width: `${indeterminate ? 20 : calculatePercentage(val, min, max)}%`
      };
  
  return (
    <div className={`progress ${indeterminate ? "indeterminate" : ""} ${className}`}>
      <div className="progress-track" style={style}></div>
    </div>
  );
}
Progress.displayName = "Progress";

export default Progress;