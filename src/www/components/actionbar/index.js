const {createComponent} = require("vidom"),
    Portal = require("@components/portal"),
    Touchable = require("@components/touchable"),

    Action = (attrs, children, context) => {
      const {text, icon, handler, event = "tap"} = attrs, className = attrs["class"];
      let item = (
        <div class={`action ${className} ${handler ? "activable" : ""}`}>
          {text ? (<span class="text">{text}</span>) : null}
          {icon ? (<i class={`icon ${icon}`}></i>) : null}
        </div>
      );
      if(handler) {
        item = (
          <Touchable action={event} onAction={handler}>
            {item}
          </Touchable>
        );
      }
      return item;
    },
    Spacer = () => (<div class="spacer"></div>),
    ActionBar = createComponent({
      onRender() {
        let className = this.attrs["class"];
        className = className || "";
        return (
          <div class={`actionbar ${className}`}>
            {this.children}
          </div>
        );
      }
    });


module.exports = {
  ActionBar,
  Action,
  Spacer
};
