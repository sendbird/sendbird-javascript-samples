# Sendbird React Native Hook sample

Sendbird React Native sample using [Sendbird SDK](https://github.com/sendbird/SendBird-SDK-JavaScript).

## Prerequisite

- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [Cocoapods](https://cocoapods.org/)
- [XCode](https://developer.apple.com/xcode)
- [XCode Command Line Tools](https://facebook.github.io/react-native/docs/getting-started.html#xcode)
- [Android Studio](https://developer.android.com/studio/) (+Android SDK/Google API)

## Run the sample

1. Install React Native CLI.

        npm install -g react-native-cli

2. Install required packages.

        npm install

3. (iOS only) Pod install.

        cd ios
        pod install
        pod update

4. (iOS only) Add library in XCode.

- Open XCode and load workspace, you should load *.xcworkspace.

5. Run the sample. Before starting, you should launch device emulator (or actual device) to run the sample in Android. This sample is not available for real device in iOS due to Apple Development Policy. In order to run React Native sample in real device, follow [React Native official guide](https://facebook.github.io/react-native/docs/running-on-device.html) for your own setup.

        npx react-native run-android
        npx react-native run-ios

For iOS, you may also launch directly from Xcode.
   
        
## Troubleshooting

1. In general
    - You can run `npm run clean` from root directory, this might help to solve some issues and clean old builds.
    - You can delete `package-lock.json`, but we do not recommend it for compatibility issues. Do it at your own risk.
    - Make sure you have prerequisite softwares installed before you run this app, they can be found here: https://facebook.github.io/react-native/docs/getting-started.
    - Deleting `node_modules` folder and reinstalling the dependencies could help.
2. iOS
    - Clean the build Cmd+Shift+K, also just rebuilding without cleaning the build can work sometimes.
    - Do `pod update` and then `pod install` in the ios/ folder
    - Delete the `ios/build` folder.
    - It is better not to change any build phases, rules, settings in XCode, as it may cause further issues.
    - You'd better to not update packages in `package.json`, or `ios/Pods`, or Android packages versions.
3. Android
    - If you run on real device, check if everything is installed especially Android studio.
    - Check if your device is visible by `adb devices`, sometimes it may not work or have lags. In this case call: `adb kill-server` and `adb start-server`.
    - You might build the project using `npx react-native run-android`, but if it fails you might need to run it with Android studio.