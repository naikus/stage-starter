const Stage = require("@naikus/stage"),
    {createComponent, mount} = require("vidom"),
    Touchable = require("@components/touchable"),
    Modal = require("@components/modal"),
    Portal = require("@components/portal"),
    Tabs = require("@components/tabs"),
    {ActionBar, Action, Spacer} = require("@components/actionbar");

Stage.defineView({
  id: "main",
  template: `<div class="stage-view main"></div>`,
  factory(appContext, viewUi) {
    const setSidebarVisible = e => appContext.setNavVisible(true),
        showSettings = e => appContext.pushView("settings"/* , {transition: "slide"} */),
        showAbout = e => appContext.pushView("about", {transition: "slide-up"}),
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
                      <span class="button activable inline primary">
                        Show/Hide Sidebar
                      </span>
                    </Touchable>
                  </Tabs.Tab>
                  <Tabs.Tab key="tab2" icon="icon-clock" title="Tab Two">
                    <Touchable action="tap" onAction={showSettings}>
                      <span class="button activable inline">Settings</span>
                    </Touchable>
                  </Tabs.Tab>
                </Tabs>
                <Modal visible={showModal} class="hello">
                  <div className="hello-world" onClick={toggleModal}>
                    Hello World!!!
                  </div>
                </Modal>
              </fragment>
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

    let modalVisible = false, actionbar;

    return {
      // Stage app lifecycle functions.
      initialize(viewOpts) {},
      getActionBar() {
        return (
          <ActionBar class="main" ref={comp => actionbar = comp}>
            <Action class="first" text="Dashboard" />
            <Spacer />
            <Action icon="icon-bell" handler={toggleModal} />
            <Action icon="icon-settings" handler={showSettings} />
            <Action icon="icon-help-circle" handler={showAbout} />
          </ActionBar>
        );
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
