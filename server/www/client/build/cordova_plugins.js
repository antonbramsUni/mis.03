cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-screen-orientation.screenorientation",
        "file": "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
        "pluginId": "cordova-plugin-screen-orientation",
        "clobbers": [
            "cordova.plugins.screenorientation"
        ]
    },
    {
        "id": "cordova-plugin-statusbar.statusbar",
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "id": "com.virtuoworks.cordova-plugin-canvascamera.CanvasCamera",
        "file": "plugins/com.virtuoworks.cordova-plugin-canvascamera/www/CanvasCamera.js",
        "pluginId": "com.virtuoworks.cordova-plugin-canvascamera",
        "clobbers": [
            "plugin.CanvasCamera",
            "CanvasCamera"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-custom-config": "3.2.0",
    "cordova-plugin-whitelist": "1.3.2",
    "cordova-plugin-add-swift-support": "1.6.2",
    "cordova-plugin-screen-orientation": "2.0.1",
    "cordova-plugin-statusbar": "2.2.3",
    "cordova-plugin-compat": "1.1.0",
    "com.virtuoworks.cordova-plugin-canvascamera": "1.0.1"
};
// BOTTOM OF METADATA
});