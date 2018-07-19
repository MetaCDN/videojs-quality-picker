import QualityMenu from './quality-menu';
import QualityMenuItem from './quality-menu-item';

const VjsButton = videojs.getComponent('MenuButton');

let TRACK_CLASS = {
    video: 'vjs-icon-cog',
    audio: 'vjs-icon-cog',
    subtitle: 'vjs-icon-subtitles'
};

class QualityPickerButton extends VjsButton {

  createMenu() {
    var menu = new QualityMenu(this.player, this.options_);
    var menuItem;
    var options;
    for (var i=0; i < this.options_.qualityList.length; i++) {
      var quality = this.options_.qualityList[i];
      var {qualitySwitchCallback, trackType} = this.options_;
      options = Object.assign({qualitySwitchCallback, trackType}, quality, { selectable: true });

      menuItem = new QualityMenuItem(this.player, options);
      menu.addItem(menuItem);
    }

    return menu;
  }

  buildCSSClass() {
    return `${TRACK_CLASS[this.options_.trackType]} vjs-icon-placeholder ${super.buildCSSClass()}`;
  }
}

export default QualityPickerButton;
