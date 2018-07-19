# Video.js v5.x quality picker

[![CircleCI](https://circleci.com/gh/streamroot/videojs-quality-picker/tree/master.svg?style=shield&circle-token=f54f17f600368beab20f9348b181073d256ca882)](https://circleci.com/gh/streamroot/videojs-quality-picker/tree/master)

Adds quality picker menus to video.js which allows users to perform manual quality selection for multi-bitrate video, or multi-language audio / subtitles. Plugin works with video.js v5.x.

NOTE: In this project, quality can refer to:
 - a specific video / audio bitrate (or auto selection)
 - a specific audio / subtitle language (or disabled subtitles)

## Development

1. `npm install` -- install the dependencies.
1. `npm run lint` -- run lint check.
1. `npm run build` -- build the quality picker.
1. `npm run dev` -- starts Webpack dev server.

## Usage

This plugin can't be used as a standalone library. It requires manual integration with video.js playback `Tech` or `Source handler`. Currently it's integrated into [videojs5-hlsjs-source-handler](https://github.com/streamroot/videojs5-hlsjs-source-handler).

To integrate quality picker into your project include it first by running `npm install --save videojs-quality-picker`. Then modify video.js `Tech` or `SourceHandler`(or create your own one). See integration example below.

Video.js requires explicit plugin initialization, so after video.js is created, initialize plugin:

```javascript
var player = videojs('example-video', options);
player.qualityPickerPlugin(); // IMPORTANT: Initialization of quality picker plugin, it won't work otherwise.
```

## Integration with video.js `Tech` or `Source handler`

### How it works

The plugin listens to the custom event `loadedqualitydata` fired by player's tech / source handler.

The tech must:
- Get the quality list from the underlying playback technology
- Format the quality list to the format given below
- Implement a callback function for the click action on the quality picker
- Trigger a custom tech event `loadedqualitydata`, with a payload which format is described below

#### Expected payload format

Here is expected payload structure:
```javascript
{
  qualityData: {
    video: [ Quality ], // An array of Quality objects, as defined below
    audio: [ Quality ],
    subtitle: [ Quality ]
  },
  qualitySwitchCallback: Function // callback function used for quality switching, as defined below
}
```

**NOTES**:
- In the following, **track type** refers to the enum: `"video" | "audio" | "subtitle"`.
- it's not mandatory to pass an array of Quality for every track type, it can be undefined. No quality picker button will be added for this track type.
- If the length of a Quality array is `<= 1`, no quality picker button will be added for its track type.

#### qualitySwitchCallback

`qualitySwitchCallback(qualityId, trackType)`

This callback function will be called with the Quality id and the the track type as arguments. Its role is to effectively perform the quality change on the player

#### Quality

##### Representation examples

```javascript
{
  id: -1,
  label: 'auto',
  selected: true
}
```

```javascript
{
  id: { adaptationSetId: 0, representationId: 2},
  label: '720p',
  selected: false
}
```

##### Properties

property    | type  |description
------------|-------|-----------------------------------
id          | Any   | Unique identifier for the quality. Can be an integer (level index for HLS), or an object ( {adaptationSetId: ..., representationId: ...} for Dash) .
label       | String | The text that will be displayed to identify this quality in the drop down menu
selected    | Boolean | Should be true for ONE quality ONLY: the one that is currently played by the player

### Hls.js integration example

Add `videojs-quality-picker` to your project by running `npm install --save videojs-quality-picker`.

```javascript
    require("videojs-quality-picker"); // include videojs-quality-picker
    
    // hls.js init
    var hls = new Hls(config);
    hls.on(Hls.Events.MANIFEST_PARSED, onManifestParsed); // Listen to the event MANIFEST_PARSED, to get the quality list.

    hls.loadSource(url);
    hls.attachMedia(video);

    //...
    //...
    //...


    // Callback function
    function switchQuality(qualityId, trackType) {
        hls.nextLevel = qualityId; // Perform quality switch using hls.js API
    }

    function onManifestParsed(event, data) {
        // 1. Format payload
        var cleanTracklist = [];

        // Add an "auto" quality.
        if (data.levels.length > 1) {
            var autoLevel = {
                id: -1,
                label: "auto",
                selected: -1 === hls.manualLevel
            };
            cleanTracklist.push(autoLevel);
        }

        // Format each hls level into the expected "Quality" format
        data.levels.forEach(function(level, index) {
            var quality = {}; // Don't write in level (shared reference with Hls.js)
            quality.id = index;
            quality.selected = index === hls.manualLevel;
            quality.label = _levelLabel(level);

            cleanTracklist.push(quality);
        });

        var payload = {
            qualityData: {video: cleanTracklist},
            qualitySwitchCallback: switchQuality
        };

        // 2. Trigger custom event from tech
        tech.trigger('loadedqualitydata', payload);

        // Helper method used to format the Quality's label
        function _levelLabel(level) {
            if (level.height) return level.height + "p";
            else if (level.width) return Math.round(level.width * 9 / 16) + "p";
            else if (level.bitrate) return (level.bitrate / 1000) + "kbps";
            else return 0;
        }
    }
```
**Don't forget to initialize the plugin after initializing video.js

```javascript
var player = videojs('example-video');
player.qualityPickerPlugin();
```

## List of supported video.js plugins & source handlers

* Quality picker if fully integrated into [videojs5-hlsjs-source-handler](https://github.com/streamroot/videojs5-hlsjs-source-handler), which adds HLS playback support to video.js 5.x using Dailymotion's hls.js library.
