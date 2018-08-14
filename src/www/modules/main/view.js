const Stage = require("stage"),
    {createComponent, mount} = require("vidom"),
    Touchable = require("touchable"),
    Tabs = require("tabs");

Stage.defineView({
  id: "main",
  template: `<div class="stage-view main"></div>`,
  factory(viewContext, viewUi) {
    const {application} = viewContext.context(),
        setSidebarVisible = e => application.showSidebar(true),
        showSettings = e => viewContext.pushView("settings"/* , {transition: "slide"} */),
        showAbout = e => viewContext.pushView("about", {transition: "slide-up"}),
        Content = createComponent({
          onInit() {
            this.setState({});
          },
          onRender() {
            return (
              <Tabs>
                <Tabs.Tab icon="icon-calendar" title="Tab One">
                  <Touchable action="tap" onAction={showSettings}>
                    <span class="button inline primary">Settings</span>
                  </Touchable>
                </Tabs.Tab>
                <Tabs.Tab icon="icon-clock" title="Tab Two">
                  <Touchable action="tap" onAction={setSidebarVisible}>
                    <span class="button inline primary">Show/Hide Sidebar</span>
                  </Touchable>
                </Tabs.Tab>
              </Tabs>
            );
          }
        }),

        // Actionbar
        ActionBar = createComponent({
          onRender() {
            return (
              <div class="actionbar main">
                <div class="action first">
                  <span class="text title">Dashboard</span>
                  {/* <!-- img class="img" src="images/logo-actionbar.png" alt="Logo" / --> */}
                </div>
                <Touchable onAction={showSettings} action="tap">
                  <div class="action activable right">
                    <i class="icon icon-settings"></i>
                  </div>
                </Touchable>
                <Touchable onAction={showAbout} action="tap">
                  <div class="action activable right">
                    <i class="icon icon-help-circle"></i>
                  </div>
                </Touchable>
              </div>
            );
          }
        });

    return {
      // Stage app lifecycle functions.
      initialize(viewOpts) {},
      getActionBar() {
        return ActionBar;
      },
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
