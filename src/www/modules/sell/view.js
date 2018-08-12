const Stage = require("stage"),
    {createComponent, mount} = require("vidom"),
    Touchable = require("touchable"),
    Tabs = require("tabs");

Stage.defineView({
  id: "sell",
  template: `<div class="stage-view no-actionbar sell"></div>`,
  factory(stageContext, viewUi) {
    const showAuth = e => {
          // console.log(e);
          stageContext.pushView("auth", {transition: "slide"});
        },
        Content = createComponent({
          onInit() {
            this.setState({});
          },
          onRender() {
            return (
              <Tabs>
                <Tabs.Tab icon="icon-calendar" title="Tab One">
                  <Touchable action="tap" onAction={showAuth}>
                    <span class="button inline primary">Settings</span>
                  </Touchable>
                </Tabs.Tab>
                <Tabs.Tab icon="icon-clock" title="Tab Two">
                  <p class="message">Hello From Tab 2</p>
                </Tabs.Tab>
              </Tabs>
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
                <Touchable onAction={showAuth} action="tap">
                  <div class="action activable right">
                    <i class="icon icon-settings"></i>
                  </div>
                </Touchable>
              </div>
            );
          }
        });

    return {
      /*
      getActionBar() {
        return ActionBar;
      },
      */
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
