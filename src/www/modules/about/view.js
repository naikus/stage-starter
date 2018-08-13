const Stage = require("stage"),
    {createComponent, mount} = require("vidom"),
    Touchable = require("touchable");

Stage.defineView({
  id: "about",
  template: `<div class="stage-view no-actionbar about alt-bg"></div>`,
  factory(stageContext, viewUi) {
    const goBack = _ => stageContext.popView(),
        Content = createComponent({
          onRender() {
            return (
              <div class="content text-center" style={{marginTop: "150px"}}>
                <p>Made using stage.js and vidom</p>
                <Touchable action="tap" onAction={goBack}>
                  <span class="button primary inline">OK</span>
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
