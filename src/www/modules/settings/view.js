/* global location */
const Stage = require("stage"),
    {createComponent, mount, unmount} = require("vidom"),
    Touchable = require("touchable"),
    {Form, rb} = require("form"),
    {Storage, Config} = require("app");

// console.log(Storage, Config, Form, Rules, rb);

Stage.defineView({
  id: "settings",
  // template not strictly needed unless you want custom CSS class
  template: `<div class="stage-view settings alt-bg"></div>`,
  factory(stageContext, viewUi) {
    let previousView = null;
    const goBack = () => {
          previousView ? stageContext.popView() : location.reload();
        },

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
              settings: {
                fullName: settings.fullName,
                city: settings.city || "Pune",
                address: settings.address
              }
            });
          },
          onRender() {
            const {settings: {fullName, city, address}, valid} = this.state;
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
                  <Touchable onAction={this.saveSettings.bind(this)} action="tap">
                    <span disabled={!valid} class="button _pull-right primary inline">
                      Save
                    </span>
                  </Touchable>
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
            Storage.set("settings", settings);
            goBack();
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
              <div class="actionbar settings">
                {back}
                <div class={"action" + (!previousView ? " first" : "")}>
                  <span class="text">Settings</span>
                </div>
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
        previousView = viewOpts.fromView;
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
