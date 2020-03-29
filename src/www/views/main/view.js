const Stage = require("@naikus/stage"),
    {createComponent, mount} = require("vidom"),
    Touchable = require("@components/touchable"),
    Modal = require("@components/modal"),
    Tabs = require("@components/tabs");

Stage.defineView({
  id: "main",
  template: `<div class="stage-view main"></div>`,
  factory(viewContext, viewUi) {
    let modalVisible = false;
    const setSidebarVisible = e => viewContext.setNavVisible(true),
        showSettings = e => viewContext.pushView("settings"/* , {transition: "slide"} */),
        showAbout = e => viewContext.pushView("about", {transition: "slide-up"}),
        Content = createComponent({
          onInit() {
            this.setState({});
          },
          onRender() {
            const {showModal} = this.attrs.options;
            return (
              <fragment>
                <Tabs>
                  <Tabs.Tab key="tab1" icon="icon-calendar" title="Tab One">
                    <Touchable action="tap" onAction={setSidebarVisible}>
                      <span class="button activable inline primary">Show/Hide Sidebar</span>
                    </Touchable>
                  </Tabs.Tab>
                  <Tabs.Tab key="tab2" icon="icon-clock" title="Tab Two">
                    <Touchable action="tap" onAction={showSettings}>
                      <span class="button activable inline">Settings</span>
                    </Touchable>
                  </Tabs.Tab>
                </Tabs>
                <Modal visible={showModal} class="hello">
                  <div className="hello-world" onClick={toggleModal}>Hello World!!!</div>
                </Modal>
              </fragment>
            );
          }
        }),

        // Actionbar
        ActionBar = createComponent({
          onRender() {
            return (
              <div class="actionbar">
                <div class="action first">
                  <span class="text title">Dashboard</span>
                  {/* <!-- img class="img" src="images/logo-actionbar.png" alt="Logo" / --> */}
                </div>
                <div class="filler"></div>
                <Touchable onAction={toggleModal} action="tap">
                  <div class="action activable">
                    <i class="icon icon-bell"></i>
                  </div>
                </Touchable>
                <Touchable onAction={showSettings} action="tap">
                  <div class="action activable">
                    <i class="icon icon-settings"></i>
                  </div>
                </Touchable>
                <Touchable onAction={showAbout} action="tap">
                  <div class="action activable">
                    <i class="icon icon-help-circle"></i>
                  </div>
                </Touchable>
              </div>
            );
          }
        }),
        toggleModal = () => {
          modalVisible = !modalVisible;
          renderContent({showModal: modalVisible});
        },
        renderContent = (viewOpts, done) => {
          mount(viewUi, <Content options={viewOpts} />, null, done);
        };

    return {
      // Stage app lifecycle functions.
      initialize(viewOpts) {},
      getActionBar() {
        return ActionBar;
      },
      onBackButton() {
        if(modalVisible) {
          toggleModal();
        }else {
          navigator.app.exitApp();
        }
      },
      activate(viewOpts, done) {
        renderContent(viewOpts, done);
      },
      update(viewOpts) {
        renderContent(viewOpts);
      },
      deactivate(viewOpts) {},
      destroy() {}
    };
  }
});
