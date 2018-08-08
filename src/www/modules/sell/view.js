const Stage = require("stage"),
    {createComponent, mount} = require("vidom");

Stage.defineView({
  id: "sell",
  template: `<div class="stage-view sell"></div>`,
  factory(stageContext, viewUi) {
    const showAuth = e => stageContext.pushView("auth"),
        Content = createComponent({
          onInit() {
            this.setState({});
          },
          onRender() {
            return (
              <div class="content">
                <button class="primary" onClick={showAuth}>Settings</button>
              </div>
            );
          },
          onUpdate() {}
        }),

        // Actionbar
        ActionBar = createComponent({
          onRender() {
            return (
              <div class="actionbar main">
                <div class="action first">
                  <span class="text title">Sell</span>
                  {/* <!-- img class="img" src="images/logo-actionbar.png" alt="Logo" / --> */}
                </div>
                <div class="action activable right" onClick={showAuth}>
                  <i class="icon icon-settings"></i>
                </div>
              </div>
            );
          }
        });

    return {
      getActionBar() {
        return ActionBar;
      },
      // Stage app lifecycle functions. All are optional
      initialize(viewOpts) {},
      activate(viewOpts, done) {
        mount(viewUi, <Content />, null, done);
      },
      update(viewOpts) {
        mount(viewUi, <Content />, null);
      },
      deactivate(viewOpts) {},
      destroy() {}
    };
  }
});
