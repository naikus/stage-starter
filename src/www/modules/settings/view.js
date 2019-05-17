/* global location */
const Stage = require("stage"),
    {createComponent, mount, unmount} = require("vidom"),
    Touchable = require("touchable"),
    {SpinButton, Form, rb} = require("form"),
    {Storage, Config} = require("app");

// console.log(Storage, Config, Form, Rules, rb);

Stage.defineView({
  id: "settings",
  // template not strictly needed unless you want custom CSS class
  template: `<div class="stage-view settings"></div>`,
  factory(viewContext, viewUi) {
    let previousView = null;
    const goBack = () => previousView ? viewContext.popView() : location.reload(),
        showAbout = e => viewContext.pushView("about", {transition: "slide-up"}),

        validationRules = {
          fullName: [
            rb("required")
          ],
          address: [
            rb("required")
          ]
        },

        Content = createComponent({
          onInit() {
            const settings = Storage.get("settings") || {};
            this.setState({
              valid: false,
              busy: false,
              settings: {
                fullName: settings.fullName,
                city: settings.city || "Pune",
                address: settings.address
              }
            });
          },
          onRender() {
            const {settings: {fullName, city, address}, valid, busy} = this.state;
            return (
              <div class="content">
                <p class="message">
                  A sample form with validation
                </p>
                <Form rules={validationRules} onChange={this.handleFormChange.bind(this)}>
                  <input type="text"
                    name="fullName"
                    defaultValue={fullName}
                    label="Full Name"
                    data-hint="Your given name and last name" />

                  <select name="city"
                    defaultValue={city}
                    label="City"
                    data-hint="Choose a city">
                    <option value="Banglore">Banglore</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                  </select>

                  <textarea name="address"
                    defaultValue={address}
                    label="Address"
                    data-hint="Your street address" />
                </Form>
                <div class="actions">
                  <SpinButton onClick={this.saveSettings.bind(this)}
                    class="_pull-right primary inline"
                    disabled={!valid || busy}
                    busy={busy}>
                    Save
                  </SpinButton>
                </div>
              </div>
            );
          },

          handleFormChange(formModel) {
            const {fields, valid} = formModel;
            if(valid) {
              const newSettings = fields.reduce((s, f) => {
                s[f.name] = f.value;
                return s;
              }, {});
              console.log(newSettings);
              this.setState({
                valid,
                settings: newSettings
              });
            }else {
              this.setState({valid: false});
            }
          },

          saveSettings() {
            const {settings} = this.state;
            this.setState({busy: true});
            window.setTimeout(() => {
              this.setState({busy: false});
              Storage.set("settings", settings);
              goBack();
            }, 2000);
          }
        }),

        ActionBar = createComponent({
          onRender() {
            const back = previousView ? (
              <Touchable onAction={goBack} action="tap">
                <div class="action activable">
                  <i class="icon icon-arrow-left"></i>
                </div>
              </Touchable>
            ) : null;
            return (
              <div class="actionbar">
                {back}
                <div class={"action" + (!previousView ? " first" : "")}>
                  <span class="text">Settings</span>
                </div>
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
      getActionBar() {
        return ActionBar;
      },
      initialize(viewOpts) {
        viewUi.addEventListener("transitionout", e => {
          // unmount(viewUi);
        });
      },
      activate(viewOpts, done) {
        const {fromView, viewAction} = viewOpts;
        previousView = viewContext.previousView();
        mount(viewUi, <Content />, {}, done);
      },
      update(viewOpts) {
        mount(viewUi, <Content />, null);
      },
      deactivate() {
      },
      destroy() {}
    };
  }
});
