const {createComponent} = require("vidom"),
    Touchable = require("touchable");

module.exports = createComponent({
  displayName: "SpinButton",
  propTypes: {
    onClick: "func",
    disabled: "bool",
    busy: "bool",
    icon: "string",
    class: "string"
  },
  getInitialState() {
    return {};
  },
  render() {
    const {onClick, disabled, icon = "icon-check", busy, class: className = ""} = this.attrs,
        buttonClass = "spin-button " + className + (busy ? " busy anim" : "");
    return (
      <Touchable action="tap" onAction={onClick}>
        <button className={buttonClass} disabled={disabled || busy}>
          {busy ? <i className="icon icon-loader spin" /> : <i className={"icon " + icon} />}
          &#160;
          {this.children}
        </button>
      </Touchable>
    );
  }
});
