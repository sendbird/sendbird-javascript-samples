# Sample JavaScript React-Native Redux

SendBird React-Native sample using [SendBird SDK](https://github.com/sendbird/SendBird-SDK-JavaScript)

## Prerequisite

- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [Cocoapods](https://cocoapods.org/)
- [XCode](https://developer.apple.com/xcode)
- [XCode Command Line Tools](https://facebook.github.io/react-native/docs/getting-started.html#xcode)
- [Android Studio](https://developer.android.com/studio/) (+Android SDK/Google API)

## Run the sample

1. Install React Native CLI

        npm install -g react-native-cli

2. Install required packages

        npm install

3. (iOS only) Pod install

        cd ios
        pod install

4. (iOS only) Add library in XCode

- Open XCode and load workspace, you should load *.xcworkspace
- If you encounter a compilation error of any missing libraries, check if they are present in Libraries section of your project
also check if they are listed in Build Phases -> Link Binary With Libraries. If some of them are missing add them manually
    - For example, for iOS push notifications, go to 'Libraries' > Add Files to "Project Name" > select `node_modules/react-native/Libraries/PushNotificationIOS/RCTPushNotification.xcodeproj`
        - Project Settings > Build Phases > Link Binary With Libraries > Add `libRCTPushNotification.a`
    - For gesture handler, go to 'Libraries' > Add Files to "Project Name" > select `node_modules/react-native-gesture-handler/ios/RNGestureHandler.xcodeproj`
        - Project Settings > Build Phases > Link Binary With Libraries > Add `libRNGestureHandler.a` 

5. Run the sample. Before starting, you should launch device amulator (or actual device) to run the sample in Android. This sample is not available for real device in iOS due to Apple Development Policy. In order to run React Native sample in real device, follow [React Native official guide](https://facebook.github.io/react-native/docs/running-on-device.html) for your own setup

        react-native run-android
        react-native run-ios
   For iOS, you may also launch directly from Xcode
        
## Troubleshooting

1. General
    - *After each of these you might want to rebuild the project and run*
    - We installed all the packages following official instructions and mostly followed non-manual installations using `react-native link <package-name>` command
    - You can run `npm run clear` from root directory, this might help to solve some issues and clean old builds
    - Sometimes it is advised to delete package-lock.json, but we do not recommend it for compatibility issues, do it at your own risk
    - Make sure you have prerequisite software installed before your run this app, they can be found here: https://facebook.github.io/react-native/docs/getting-started
    - Sometimes deleting node_modules folder and reinstalling them again helps 
2. iOS
    - Run the project with Xcode, build it there especially when it fails with `react-native run-ios` command
    - Closing and reopening Xcode might help
    - Clean the build Cmd+Shift+K, also just rebuilding without cleaning the build can work sometimes
    - Do `pod update` and then `pod install` in the ios/ folder
    - Delete the ios/build folder
    - It is advised not to call `react-native link` at all, as it has already been done during installation of packages from our side. In case you need this, better to do this only individually for packages: `react-native link <package-name>`
    - It is better not to change any build phases, rules, settings in XCode, as it may cause further issues
    - It is better to not update packages in package.json, or ios/Pods, or Android packages versions
        - Or do it very carefully
    - If you have an issue/error try to Google that and follow the instructions carefully
    - Sometimes, it is advised to delete Pods/ and Podfile.lock, but we don’t recommend deleting Podfile.lock for compatibility issues, use it at your own risk
    - During build time, on Xcode specifically, the RNFirebase library used to fail frequently, with Core library failing (not found). To solve this, go to ios folder and run: `pod update`, `pod install`, then run the build again in Xcode (without cleaning up the old build)
3. Android
    - If you run on real device, check if everything installed and especially Android studio 
    - Check if your device is visible by `adb devices`, sometimes it may not work or have lags. In this case call: `adb kill-server` and `adb start-server`
    - You might build the project using `react-native run-android`, but if it fails you might need to run it with Android studio

If you see an error like this: "Unable to load script from assets index.android.bundle."

1.  (in project directory) mkdir android/app/src/main/assets
2.  react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res