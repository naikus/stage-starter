const {createComponent, mount, unmountSync} = require("vidom"),
    Portal = createComponent({
      displayName: "Portal",
      onInit() {
        const element = this.element = document.createElement("div");
        element.setAttribute("class", "portal");
        const {target = "body"} = this.attrs;
        document.querySelector(target).appendChild(this.element);
      },

      onMount() {
        let {children = []} = this;
        // console.log(children);
        mount(this.element, children, this.context);
      },

      onRender() {
        let {children = []} = this;
        // console.log(children);
        mount(this.element, children, this.context);
        return null;
      },

      onUnmount() {
        unmountSync(this.element);
        this.element.parentNode.removeChild(this.element);
      }
    });

module.exports = Portal;
