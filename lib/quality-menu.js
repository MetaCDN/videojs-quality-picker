const VjsMenu = videojs.getComponent('Menu');

class QualityMenu extends VjsMenu {

  addItem(component) {
    super.addItem(component);

    component.on('click', () => {
      let children = this.children();

      for (var i=0; i < children.length; i++) {
        var child = children[i];
        if (component !== child) {
          child.selected(false);
          if (child.id_ == -1) {
            child.el_.innerText = "Auto"
          }
        }
      }

    });
  }

}

export default QualityMenu;
