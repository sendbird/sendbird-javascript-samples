# Sendbird JavaScript samples
![Platform](https://img.shields.io/badge/platform-JAVASCRIPT-orange.svg)
![Languages](https://img.shields.io/badge/language-JAVASCRIPT-orange.svg)
[![npm](https://img.shields.io/npm/v/sendbird.svg?style=popout&colorB=red)](https://www.npmjs.com/package/sendbird)

## Introduction

[Sendbird](https://sendbird.com) provides the chat API and SDK for your app, enabling real-time communication among the users. Here are various samples built using Sendbird Chat SDK.

- [**Web chat sample**](https://github.com/sendbird/SendBird-JavaScript/tree/master/web-basic-sample) is a Slack-like full screen chat sample for desktop browsers. Group channel and open channel are the two main channel types in which you can create various subtypes where users can send and receive messages. This sample is written in JavaScript with [Sendbird Chat SDK](https://github.com/sendbird/SendBird-SDK-JavaScript).

- [**Web widget sample**](https://github.com/sendbird/SendBird-JavaScript/tree/master/web-widget) is a Facebook-chat-like chat widget for websites.
 
- [**Web live chat sample**](https://github.com/sendbird/SendBird-JavaScript/tree/master/web-live-chat) is a Twitch-chat-like chat sample for desktop browsers.

- [**React native redux sample**](https://github.com/sendbird/SendBird-JavaScript/tree/master/react-native-redux-sample) is a mobile chat sample for iOS and Android.

- [**Web chat sample with SyncManager**](https://github.com/sendbird/SendBird-JavaScript/tree/master/web-basic-sample-syncmanager) is a web chat sample integrated with SyncManager, which is equipped with a local cache along with core chat features. For faster data loading and caching, the sample synchronizes with the Sendbird server and saves a list of group channels and the messages within the local cache into your client app. This sample is written in JavaScript with [Sendbird SyncManager](https://github.com/sendbird/sendbird-syncmanager-javascript) and [Sendbird Chat SDK](https://github.com/sendbird/SendBird-SDK-JavaScript). Find more about SyncManager on [Sendbird SyncManager document](https://docs.sendbird.com/javascript/sync_manager_getting_started).

> The previous samples, `react-native-sample` and `web-sample` are deprecated. For current samples, refer to `react-native-redux-sample` and `web-basic-sample`.

## Installation of Chat SDK

### Requirements

`Node.js` should be installed on your system.

### Package managers

You can download the Chat SDK for JavaScript by using two package managers below.

A. [Bower](https://bower.io/)

```
bower install sendbird
```

B. [npm](https://www.npmjs.com/package/sendbird)

```
npm install --save sendbird
```

Or you can manually download the Chat SDK from [here](https://github.com/sendbird/SendBird-SDK-JavaScript) on Github

## Previous versions

You can access the version 2 sample from the repository by switching from `master` to `v2` branch.
You can access the chat sample that uses `jQuery` from the repository by switching from `master` to [`legacy tag`](https://github.com/sendbird/SendBird-JavaScript/tree/Legacy(WebBasic)).   
