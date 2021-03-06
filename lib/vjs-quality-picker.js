import QualityPickerButton from './quality-picker-button';

function qualityPickerPlugin(options) {
    var player = this;
    var tech = this.tech_;
    var levelInitiated = false;


    let SUPPORTED_TRACKS = ["video", "audio", "subtitle"];
    let TRACK_CLASS = {
        video: 'vjs-icon-cog',
        audio: 'vjs-icon-cog',
        subtitle: 'vjs-icon-subtitles'
    };
    let TRACK_ID_CLASS = {
        video: 'vjs-quality-picker-video',
        audio: 'vjs-quality-picker-audio',
        subtitle: 'vjs-quality-picker-subtitle' 
    };

    tech.on('loadedqualitydata', onQualityData);
    tech.on('switchqualitylevel', onQualityLevelSwitch);
    tech.on('levelLoading', onLevelLoading);

    function onLevelLoading(event, level) {
        if (!levelInitiated) {
            onQualityLevelSwitch(null, level)
        }
    }

    function onQualityLevelSwitch(event, _level) {
        var qualityPicker = player.controlBar.getChild('videoPickerButton')
        if (qualityPicker) {
            levelInitiated = true
            var item = qualityPicker.menu.children()[0]
            var selectedQualityItem = qualityPicker.menu.children()[_level.level+1]
            var text = ""
            if (selectedQualityItem) {
                text = selectedQualityItem.options_.label;
            }
            if (item && item.el_.className.indexOf('vjs-selected') > -1) {
                item.el_.innerText = "Auto (" + text + ")"
            } else {
                item.el_.innerText = "Auto"
            }
            console.log("Level updated to: " + text)
        }
    }

    function onQualityData(event, {qualityData, qualitySwitchCallback}) {

        var fullscreenToggle = player.controlBar.getChild('fullscreenToggle');
        player.controlBar.removeChild(fullscreenToggle);

        for (var track of SUPPORTED_TRACKS) {

            var name = track + "PickerButton";
            var qualityPickerButton = player.controlBar.getChild(name);
            if (qualityPickerButton) {
                qualityPickerButton.dispose();
                player.controlBar.removeChild(qualityPickerButton);
            }

            if (qualityData[track] && qualityData[track].length > 1) {
                qualityPickerButton = new QualityPickerButton(player, {name, qualityList: qualityData[track], qualitySwitchCallback, trackType: track});
                qualityPickerButton.addClass(TRACK_CLASS[track]);
                qualityPickerButton.addClass(TRACK_ID_CLASS[track]);

                player.controlBar.addChild(qualityPickerButton);
            }
        }

        if (fullscreenToggle) {
            player.controlBar.addChild(fullscreenToggle);
        }
    }
}

videojs.plugin('qualityPickerPlugin', qualityPickerPlugin);
