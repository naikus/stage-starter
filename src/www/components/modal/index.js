const {createComponent} = require("vidom"),
    Portal = require("./portal"),
    Modal = createComponent(
      {
        onInit() {
          this.setState({wasVisible: false});
        },
        onRender() {
          // console.log(this.attrs);
          const {target = "body", visible} = this.attrs,
              clazz = this.attrs.class,
              {wasVisible} = this.state;
          return (visible || wasVisible) ?
            (
              <Portal target={target}>
                <div class={`modal-container ${visible ? "__visible": ""}`}>
                  <div class={`modal ${clazz}`}>
                    {this.children}
                  </div>
                </div>
              </Portal>
            ) :
            null;
        },
        onUpdate(prevAttrs, prevChildren, prevState, prevContext) {
          const {visible: prevVisible} = prevAttrs,
              {visible} = this.attrs,
              {wasVisible} = this.state;

          if(visible && !wasVisible) {
            this.setState({wasVisible: true});
          }
        },
        onMount() {
          // console.log("Modal Mounted");
          if(this.attrs.visible) {
            this.update();
          }
        },
        onUnmount() {
          // console.log("Modal unmounting");
        }
      },
      // Static props
      {

      }
    );

module.exports = Modal;
