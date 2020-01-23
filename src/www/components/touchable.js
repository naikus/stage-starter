const {createComponent} = require("vidom"),
    {EventTypes, stopEvent, setup} = require("@lib/touch"),

    isDisabled = target => {
      const disabled = target.getAttribute("disabled");
      return disabled === "" || disabled === "true";
    };

module.exports = createComponent({
  onMount() {
    const {action} = this.attrs, {children} = this, event = EventTypes[action],
        child = children[0] || children;
    if(child) {
      const node = this.domElement = child.getDomNode();
      this.dispatcher = this.dispatchAction.bind(this);
      this.eventDefinition = setup(node, event);
      node.addEventListener(event, this.dispatcher);
    }
  },

  onUnmount() {
    if(this.domElement && this.eventDefinition) {
      this.eventDefinition.destroy();
    }
  },

  onRender() {
    return (
      <fragment>
        {this.children}
      </fragment>
    );
  },

  dispatchAction(e) {
    stopEvent(e);
    const {onAction} = this.attrs;
    if(!isDisabled(this.domElement) && onAction) {
      window.setTimeout(_ => onAction(e), 100);
    }
  }
});
