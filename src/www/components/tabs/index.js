/* global setTimeout clearTimeout console */
const {createComponent, mount} = require("vidom"),
    TouchTarget = require("touch-target"),
    isArray = that => Object.prototype.toString.call(that) === "[object Array]",

    Tab = createComponent({
      displayName: "Tab",
      propTypes: {
        name: "string"
      },
      onRender() {
        return <div className="tab-panel">{this.children}</div>;
      }
    }),


    Tabs = createComponent({
      displayName: "Tabs",
      propTypes: {
        class: "string",
        onSelectionChanged: "function",
        activeTab: "number",
        children: "array"
      },

      selectTab(index) {
        let idx = Number(index), previousIndex = this.state.activeTab;
        idx = isNaN(idx) ? 0 : idx;
        this.setState({activeTab: idx});
        const {onSelectionChanged} = this.props;
        if(typeof onSelectionChanged === "function") {
          onSelectionChanged(index, previousIndex);
        }
      },

      renderStrip() {
        const {activeTab} = this.state,
            children = isArray(this.children) ? this.children : [this.children];
        let items;
        items = children.map((tab, i) => {
          const classNames = (i === activeTab) ? "tab-item selected" : "tab-item",
              {icon, title} = tab.attrs,
              iconEl = icon ? <i class={"icon " + icon}></i> : null;
          return (
            <TouchTarget onAction={this.selectTab.bind(this, i)} action="tap">
              <li class={classNames} key={"TabItem_" + i}>
                {iconEl}
                <span>{title}</span>
              </li>
            </TouchTarget>
          );
        });

        return (
          <ul className={"tabs-nav"}>
            {items}
          </ul>
        );
      },

      renderContent() {
        const idx = this.state.activeTab || 0;
        return isArray(this.children) ? this.children[idx] : this.children;
      },

      onInit() {
        this.setState({
          activeTab: this.attrs.activeTab || 0
        });
      },

      onRender() {
        const clazz = this.attrs.class || "";
        return (
          <div class={"tabs " + clazz}>
            {this.renderStrip()}
            <div class="tabs-content">
              {this.renderContent()}
            </div>
          </div>
        );
      }
    });

Tabs.Tab = Tab;

module.exports = Tabs;
