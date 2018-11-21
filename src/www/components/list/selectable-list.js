const {createComponent} = require("vidom"),
    Touchable = require("touchable"),
    SelectableList = createComponent({
      comparator: (itemA, itemB) => itemA && itemB && itemA.id === itemB.id,
      setItem(item) {
        this.setState({selectedItem: item});
        const {onItemSelected} = this.attrs;
        if(onItemSelected) {
          onItemSelected(item);
        }
      },

      onInit() {
        this.setState({
          selectedItem: this.attrs.selectedItem || {}
        });
      },
      onRender() {
        const {items,
              comparator = this.comparator,
              renderer = item => item.name
            } = this.attrs,
            {selectedItem} = this.state,
            renderedItems = items.map(item => {
              const clazz = "activable" + (comparator(item, selectedItem) ? " selected" : "");
              return (
                <Touchable action="tap" onAction={this.setItem.bind(this, item)}>
                  <li class={clazz} key={item.id}>
                    {renderer(item)}
                  </li>
                </Touchable>
              );
            });
        return (
          <ul class={this.attrs.class || "selectable-list"}>
            {renderedItems}
          </ul>
        );
      }
    });

module.exports = SelectableList;
