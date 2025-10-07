import "dotenv/config"

export default {
  "expo": {
    "name": "charted",
    "slug": "charted",
    "scheme": "charted",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "extra": {
      "spotifyClientId": process.env.SPOTIFY_CLIENT_ID || "" 
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.anonymous.charted"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.anonymous.charted"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-secure-store",
      "expo-web-browser"
    ]
  }
}
