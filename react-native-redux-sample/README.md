# Sample JavaScript React-Native Redux

This is a React-Native sample built using using the [SendBird SDK](https://github.com/smilefam/SendBird-SDK-JavaScript).

## How to run the sample

> Require that you have Node, Xcode, Android Studio installed.
> Xcode - Preferences - Locations - Command Line Tools needs to be set.

1. Install React Native CLI

        npm install -g react-native-cli

2. Install package

        npm install

3. (iOS only) Pod install

        cd ios
        brew install cocoapod
        pod install

4.1. Start iOS sample      

        react-native run-ios

4.2. Start Android sample. Before starting, you should launch device amulator (or actual device) to run the sample in Android.

        react-native run-android
