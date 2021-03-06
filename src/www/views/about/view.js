const Stage = require("@naikus/stage"),
    {createComponent, mount} = require("vidom"),
    Touchable = require("@components/touchable");

Stage.defineView({
  id: "about",
  template: `<div class="stage-view no-actionbar about"></div>`,
  factory(appContext, viewUi) {
    const goBack = _ => appContext.popView(),
        Content = createComponent({
          onRender() {
            return (
              <div class="content text-center">
                <p>Made using stage.js and vidom</p>
                <Touchable action="tap" onAction={goBack}>
                  <span class="button activable primary inline">OK</span>
                </Touchable>
              </div>
            );
          }
        });
    return {
      activate(viewOpts, done) {
        mount(viewUi, <Content />, null, done);
      }
    };
  }
});
