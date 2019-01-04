# Sample JavaScript React-Native Redux

SendBird React-Native sample using [SendBird SDK](https://github.com/smilefam/SendBird-SDK-JavaScript).

## Prerequisite

### Basic Requirements

- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- React Native cli - `npm install -g react-native-cli`

### Compiling React Native to Android (Mac)

- [Android Studio] (https://developer.android.com/studio/) (+Android SDK/Google API) Note: Android Studio may need further configuration to run [React Native](https://facebook.github.io/react-native/docs/getting-started).
- [Java SDK 8] (https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

### Compiling React Native to Android (Windows)

- [Android Studio](https://developer.android.com/studio/) (+Android SDK/Google API) Note: Android Studio may need further configuration to run [React Native](https://facebook.github.io/react-native/docs/getting-started).
- [Java SDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- [Python 2](https://www.howtogeek.com/197947/how-to-install-python-on-windows/)

### Compiling React Native to IOS (Mac only)

- [Cocoapods](https://cocoapods.org/)
- [XCode](https://developer.apple.com/xcode)
- [XCode Command Line Tools](https://facebook.github.io/react-native/docs/getting-started.html#xcode)


For latest details on setting up React Native to run in your environment please refer to [Building Projects with Native Code](https://facebook.github.io/react-native/docs/getting-started.html)

## Run the sample

1. Install React Native CLI.

        npm install -g react-native-cli

2. Navigate to project folder and install required packages.

        npm install
        react-native link

3. (iOS only) Pod install.

        cd ios
        pod install

4. (iOS only) Add library in XCode

- Open XCode and load workspace
- Right click to 'Libraries' > Add Files to "Project Name" > select `node_modules/react-native/Libraries/PushNotificationIOS/RCTPushNotification.xcodeproj`
- Project Settings > Build Phases > Link Binary With Libraries > Add `libRCTPushNotification.a`

5. Run the sample. Before starting, you should launch device amulator (or actual device) to run the sample in Android. This sample is not available for real device in iOS due to Apple Development Policy. In order to run React Native sample in real device, follow [React Native official guide](https://facebook.github.io/react-native/docs/running-on-device.html) for your own setup.

6. Once the device is running open a terminal inside the project's home folder and run (home folder example:  ~/{somefolder}/{somefolder}/ReactNativeWithSendBird):

        react-native run-android
        react-native run-ios
