# Sendbird SyncManager for JavaScript sample
![Platform](https://img.shields.io/badge/platform-JAVASCRIPT-orange.svg)
![Languages](https://img.shields.io/badge/language-JAVASCRIPT-orange.svg)
[![npm](https://img.shields.io/npm/v/sendbird-syncmanager.svg?style=popout&colorB=red)](https://www.npmjs.com/package/sendbird-syncmanager)

## Introduction

SyncManager for Javascript is a Chat SDK add-on that optimizes the user caching experience by interlinking the synchronization of the local data storage with the chat data in Sendbird server through an event-driven structure. Provided here is a SyncManager sample for Javascript to experience first-hand the benefits of Sendbird’s SyncManager.

### Benefits

Sendbird SyncManager provides the local caching system and data synchronization with the Sendbird server, which are run on an event-driven structure. According to the real-time events of the messages and channels, SyncManager takes care of the background tasks for the cache updates from the Sendbird server to the local device. By leveraging this systemized structure with connection-based synchronization, SyncManager allows you to easily integrate the Chat SDK to utilize all of its features, while also reducing data usage and offering a reliable and effortless storage mechanism. 

### More about Sendbird SyncManager for JavaScript

Find out more about Sendbird SyncManager for JavaScript at [SyncManager for JavaScript doc](https://sendbird.com/docs/syncmanager/v1/javascript/getting-started/about-syncmanager). If you need any help in resolving any issues or have questions, visit [our community](https://community.sendbird.com).

<br />

## Before getting started
This section provides the prerequisites for testing Sendbird Desk for Javascript sample app.

### Requirements
The minimum requirements for SyncManager for Javascript are:
- Node. js v10+
- NPM v6+
- [Chat SDK for JavaScript](https://github.com/sendbird/SendBird-SDK-JavaScript) v3.0 115+

### Try the sample app using your data 

If you would like to try the sample app specifically fit to your usage, you can do so by replacing the default sample app ID with yours, which you can obtain by [creating your Sendbird application from the dashboard](https://sendbird.com/docs/chat/v3/javascript/getting-started/install-chat-sdk#2-step-1-create-a-sendbird-application-from-your-dashboard). Furthermore, you could also add data of your choice on the dashboard to test. This will allow you to experience the sample app with data from your Sendbird application. 

### Try the SyncManager on our demo website 

By using this [link](https://sample.sendbird.com/basic/sync-manager), you can test the SyncManager through our demo website. 

<br />

## Getting started

You can install and run SyncManager for JavaScript sample app on your system using `npm`.

### Install packages

`Node` v8.x+ should be installed on your system.

```bash
npm install
```

### Run the sample

```bash
npm start
```

<br />

## Customizing the sample

To implement customization to the sample, you can use `webpack` for buiding it. 

### Install packages

`Node` v8.x+ should be installed on your system.

```bash
npm install
``` 

### Modify files

If you want to change `APP_ID`, change `APP_ID` in `const.js` to the other `APP_ID` you want.  You can test the sample with local server by running the following command.  

```bash
npm run start:dev
``` 

### Build the sample

When the modification is complete, you'll need to bundle the file using `webpack`. The bundled files are created in the **dist** folder. Please check `webpack.config.js` for settings.    

```bash
npm run build
```
