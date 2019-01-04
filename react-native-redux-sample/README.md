# Sample JavaScript React-Native Redux

SendBird React-Native sample using [SendBird SDK](https://github.com/smilefam/SendBird-SDK-JavaScript).

## Prerequisite

### Basic Requirements

- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- React Native cli - `npm install -g react-native-cli`

### Compiling React Native in Android Studio (Mac)

- [Java SDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- [Android Studio](https://developer.android.com/studio/) (+Android SDK/Google API) Note: Android Studio may need further [configuration to run React Native](https://facebook.github.io/react-native/docs/getting-started).


### Compiling React Native in Android Studio (Windows)

- [Java SDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- [Python 2](https://www.howtogeek.com/197947/how-to-install-python-on-windows/)
- [Android Studio](https://developer.android.com/studio/) (+Android SDK/Google API) Note: Android Studio may need further configuration to run [React Native](https://facebook.github.io/react-native/docs/getting-started).


### Compiling React Native to IOS (Mac only)

- [Cocoapods](https://cocoapods.org/)
- [XCode](https://developer.apple.com/xcode)
- [XCode Command Line Tools](https://facebook.github.io/react-native/docs/getting-started.html#xcode)


For latest details on setting up React Native to run in your environment please refer to [Building Projects with Native Code](https://facebook.github.io/react-native/docs/getting-started.html)

## Compile to Android (Mac)

## Run the sample

1. Download or clone the whole SendBird JavaScript Repro.
       
2. Open Android Studio (This assumes you have configured Android Studio to compile React Native code) - at the prompt click "Open an existing Android project" - navigate to the project folder

        SendBird-JavaScript/react-native-redux-sample/ReactNativeWithSendBird/
        
3. Open an Android Studio terminal (main Andriod Studio window - bottom left) and install packages. 

        npm install
        react-native link

4. Launch a device emulator by opening the "AVD Manager" or attach a real device. For an emulated device make sure it is running the Oreo API Level 27 image (you can select these settings when creating a new device). 

5. Make sure the emulated device is running (You should have a sample phone on your screen)

5. Start up the sample code. In the terminal `react-native run-android`, and wait for the compling to complete.

6. Navigate to the emulated device. 


Note: 
In order to run React Native sample in real device, follow [React Native official guide](https://facebook.github.io/react-native/docs/running-on-device.html) for your own setup.




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
