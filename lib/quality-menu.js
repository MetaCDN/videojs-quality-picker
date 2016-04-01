const VjsMenu = videojs.getComponent('Menu');

class QualityMenu extends VjsMenu {

  addItem(component) {
    super.addItem(component);

    component.on('click', () => {
      let children = this.children();

      for (var child of children) {
        if (component !== child) {
          child.selected(false);
          if (child.id == -1) {
            child.el_.innerText = "Auto"
          }
        }
      }

    });
  }

}

export default QualityMenu;
