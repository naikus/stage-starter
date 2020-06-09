/* global location */
const Stage = require("@naikus/stage"),
    {createComponent, mount, unmount} = require("vidom"),
    Touchable = require("@components/touchable"),
    {SpinButton, Form, rb} = require("@components/form"),
    {ActionBar, Action, Spacer} = require("@components/actionbar");

// console.log(Storage, Config, Form, Rules, rb);

Stage.defineView({
  id: "settings",
  // template not strictly needed unless you want custom CSS class
  template: `<div class="stage-view settings"></div>`,
  factory(appContext, viewUi) {
    let previousView = null;
    const goBack = () => previousView ? appContext.popView() : location.reload(),
        showAbout = e => appContext.pushView("about", {transition: "slide-up"}),
        storage = appContext.getLocalStorage(),
        validationRules = {
          fullName: [
            rb("required")
          ],
          address: [
            rb("required")
          ],
          agreeToTerms: [
            (value, field, fields) => {
              if(!value) {
                return {valid: false, message: "You must agree to terms and conditions"};
              }
            }
          ]
        },

        Content = createComponent({
          onInit() {
            const settings = storage.get("settings") || {};
            this.setState({
              valid: false,
              busy: false,
              settings: {
                fullName: settings.fullName,
                city: settings.city || "Pune",
                address: settings.address,
                agreeToTerms: true
              }
            });
          },
          onRender() {
            const {settings: {fullName, city, address, agreeToTerms}, valid, busy} = this.state;
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

                  <input name="agreeToTerms"
                    type="checkbox"
                    defaultValue={agreeToTerms}
                    label="I agree to terms and conditions"
                    data-hint="You must agree :D" />
                </Form>
                <div class="actions">
                  <SpinButton onClick={this.saveSettings.bind(this)}
                    class="_pull-right activable primary inline"
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
              storage.set("settings", settings);
              goBack();
            }, 2000);
          }
        });

    let actionbar;

    return {
      getActionBar() {
        // return <ActionBar ref={el => this.actionBar = el} />;
        const back = previousView ? (<Action icon="icon-arrow-left" handler={goBack} />) : null;
        return (
          <ActionBar class="settings" ref={comp => actionbar = comp}>
            {back}
            <Action class={previousView ? "" : "first"} text="Settings" />
            <Spacer />
            <Action icon="icon-help-circle" handler={showAbout} />
          </ActionBar>
        );
      },
      initialize(viewOpts) {
        viewUi.addEventListener("transitionout", e => {
          // unmount(viewUi);
        });
      },
      activate(viewOpts, done) {
        const {fromView, viewAction} = viewOpts;
        previousView = appContext.previousView();
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
