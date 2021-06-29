# Sendbird JavaScript samples
![Platform](https://img.shields.io/badge/platform-JAVASCRIPT-orange.svg)
![Languages](https://img.shields.io/badge/language-JAVASCRIPT-orange.svg)
[![npm](https://img.shields.io/npm/v/sendbird.svg?style=popout&colorB=red)](https://www.npmjs.com/package/sendbird)

Sendbird provides an easy-to-use Chat API, native Chat SDKs, UIKits, and a fully-managed chat platform on the backend that provides delivery receipts, offline messaging, presence, translation, moderation tools, and analytics.

The best way to get started is through the [JavaScript Getting Started guide](https://sendbird.com/docs/chat/v3/javascript/getting-started/about-chat-sdk).


## Introduction

This repository contains samples for how to use Sendbird with plain Javascript, React and React Native. You can find more information  in the [Javascript SDK documentation](https://sendbird.com/docs/chat/v3/javascript/getting-started/about-chat-sdk) and [React Quickstart Documentation](https://sendbird.com/docs/uikit/v1/react/quickstart/send-first-message)

### React
Sendbird UIKit for React is a set of prebuilt UI components that allows you to easily craft an in-app chat with all the essential messaging features. Our development kit includes light and dark themes, text fonts, colors and more. All the included components can be styled and customized to create an unique experience that fits your app.

- [**Basic React App**](https://github.com/sendbird/SendBird-JavaScript/react-app-simple) is a quickest way to get started using the React UIKit
- [**Composed React App**](https://github.com/sendbird/SendBird-JavaScript/react-app-simple) demonstrates how to use the various smart components.
- [**Custom React App**](https://github.com/sendbird/SendBird-JavaScript/react-app-simple) shows how to customize the **Message**, **ChannelPreview**, and **UserList** UI elements.


### React Native
The Sendbird React Native framework allows you to simplify development for iOS and Android apps, and reuse the same code on both web and mobile apps.

- [**React native Redux**](https://github.com/sendbird/SendBird-JavaScript/tree/master/react-native-redux) shows how to use Sendbird with React Native on iOS and Android.
- [**React native Redux Syncmanager**](https://github.com/sendbird/SendBird-JavaScript/tree/master/react-native-redux-syncmanager) Expands on the above sample and implements the [Sendbird SyncManager](https://github.com/sendbird/sendbird-syncmanager-javascript)
- [**React Native Hooks**](https://github.com/sendbird/SendBird-JavaScript/tree/master/react-native-hook) Implements Sendbird on iOS and Android using the hooks pattern.


### JavaScript

- [**Web chat sample**](https://github.com/sendbird/SendBird-JavaScript/tree/master/web-basic-sample) is a Slack-like full screen chat sample for desktop browsers. Group channel and open channel are the two main channel types in which you can create various subtypes where users can send and receive messages. This sample is written in JavaScript with [Sendbird Chat SDK](https://github.com/sendbird/SendBird-SDK-JavaScript).

- [**Web widget sample**](https://github.com/sendbird/SendBird-JavaScript/tree/master/web-widget) is a Facebook-chat-like chat widget for websites.
 
- [**Web live chat sample**](https://github.com/sendbird/SendBird-JavaScript/tree/master/web-live-chat) is a Twitch-chat-like chat sample for desktop browsers.

- [**Web chat sample with SyncManager**](https://github.com/sendbird/SendBird-JavaScript/tree/master/web-basic-sample-syncmanager) is a web chat sample integrated with SyncManager, which is equipped with a local cache along with core chat features. For faster data loading and caching, the sample synchronizes with the Sendbird server and saves a list of group channels and the messages within the local cache into your client app. This sample is written in JavaScript with [Sendbird SyncManager](https://github.com/sendbird/sendbird-syncmanager-javascript) and [Sendbird Chat SDK](https://github.com/sendbird/SendBird-SDK-JavaScript). Find more about SyncManager on [Sendbird SyncManager document](https://sendbird.com/docs/syncmanager/v1/javascript/getting-started/about-syncmanager).


<br />

## Installation

To use the Sendbird Chat SDK directly you can install it through npm or yarn with

```bash
npm install --save sendbird
```
or

```bash
yarn install --save sendbird
```

Or download the latest release manually from [GitHub](https://github.com/sendbird/SendBird-SDK-JavaScript)



[UIKit for React doc](https://sendbird.com/docs/uikit/v1/javascript/getting-started/about-uikit). If you need any help in resolving any issues or have questions, visit [our community](https://community.sendbird.com).