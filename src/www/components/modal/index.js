const {createComponent} = require("vidom"),
    Portal = require("./portal"),
    Modal = createComponent(
      {
        onInit() {
          this.setState({
            visible: false
          });
        },
        onRender() {
          const {target = "body"} = this.attrs, {visible} = this.state;
          console.log("Modal rendering", visible);
          return (
            <Portal target={target}>
              <div class={`modal-container${visible ? " __visible": " "}`}>
                <div class="modal">
                  {this.children}
                </div>
              </div>
            </Portal>
          );
        },
        onMount() {
          console.log("Modal Mounted");
          window.setTimeout(_ => {
            this.setState({visible: true});
          }, 1300);
        }
      },
      // Static props
      {

      }
    );

module.exports = Modal;
