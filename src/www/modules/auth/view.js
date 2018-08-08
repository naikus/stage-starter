const Stage = require("stage"),
    {createComponent, mount, unmount} = require("vidom"),
    {Form, rb} = require("form"),
    {Storage, Config} = require("app");

// console.log(Storage, Config, Form, Rules, rb);

Stage.defineView({
  id: "auth",
  // template not strictly needed unless you want custom CSS class
  template: `<div class="stage-view auth"></div>`,
  factory(stageContext, viewUi) {
    let previousView = null;
    const goBack = () => {
          previousView && stageContext.popView();
        },

        validationRules = {
          accountId: [
            rb("required")
          ],
          apiKey: [
            rb("required")
          ]
        },

        Content = createComponent({
          onInit() {
            const auth = Storage.get("auth") || {};
            this.setState({
              valid: false,
              accountId: auth.accountId,
              apiKey: auth.apiKey
            });
          },
          onRender() {
            const {accountId, apiKey, valid} = this.state;
            return (
              <div class="content">
                <p class="message">
                  Set or change your accountId and API key here.
                  Leave blank if you've already set it.
                </p>
                <Form rules={validationRules} onChange={this.handleFormChange.bind(this)}>
                  <input type="text"
                    name="accountId"
                    defaultValue={accountId}
                    label="Accound ID"
                    data-hint="Your Auth0 Account Id" />

                  <textarea name="apiKey"
                    defaultValue={apiKey}
                    label="API Key"
                    data-hint="Your Auth0 API Key" />
                </Form>
                <div class="actions">
                  <button disabled={!valid} onClick={this.saveAuth.bind(this)}
                    class="_pull-right primary inline">
                    Save
                  </button>
                </div>
              </div>
            );
          },

          handleFormChange(formModel) {
            const {fields, valid} = formModel;
            if(valid) {
              const auth = fields.reduce((auth, f) => {
                auth[f.name] = f.value;
                return auth;
              }, {});
              this.setState({
                valid,
                ...auth
              });
            }else {
              this.setState({valid: false});
            }
          },

          saveAuth() {
            const {accountId, apiKey} = this.state;
            Storage.set("auth", {
              accountId,
              apiKey
            });
            goBack();
          }
        }),

        ActionBar = createComponent({
          onRender() {
            const back = previousView ? (
              <div class="action activable" onClick={goBack}>
                <i class="icon icon-arrow-left"></i>
              </div>
            ) : null;
            return (
              <div class="actionbar auth">
                {back}
                <div class={"action" + (!previousView ? " first" : "")}>
                  <span class="text">Auth Information</span>
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
