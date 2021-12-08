# Sendbird Local Caching for JavaScript sample
![Platform](https://img.shields.io/badge/platform-JAVASCRIPT-orange.svg)
![Languages](https://img.shields.io/badge/language-JAVASCRIPT-orange.svg)
[![npm](https://img.shields.io/npm/v/sendbird.svg?style=popout&colorB=red)](https://www.npmjs.com/package/sendbird)

## Introduction

Local Caching enables Sendbird Chat SDK for JavaScript to locally cache and retrieve group channel and message data. This facilitates offline messaging by allowing the SDK to create a channel list view or a chat view in a prompt manner and display them even when a client app is in offline mode. Provided here is a Local Caching for JavaScript sample to experience first-hand the benefits of Sendbird's Local Caching.

### Benefits

Sendbird Local Caching provides the local caching system and data synchronization with the Sendbird server, which are run on an event-driven structure. According to the real-time events of the messages and channels, Local Caching takes care of the background tasks for the cache updates from the Sendbird server to the local device. By leveraging this systemized structure with connection-based synchronization, Local Caching allows you to easily integrate the Chat SDK to utilize all of its features, while also reducing data usage and offering a reliable and effortless storage mechanism. 

### More about Sendbird Local Caching for JavaScript

Find out more about Sendbird Local Caching for JavaScript at [Local Caching for JavaScript doc](https://sendbird.com/docs/chat/v3/javascript/guides/local-caching). If you need any help in resolving any issues or have questions, visit [our community](https://community.sendbird.com).

<br />

## Before getting started
This section provides the prerequisites for testing Sendbird Desk for JavaScript sample app.

### Requirements
The minimum requirements for Local Caching for JavaScript are:
- Node.js v10+
- NPM v6+
- [Chat SDK for JavaScript](https://github.com/sendbird/SendBird-SDK-JavaScript) v3.1.0 or higher

### Try the sample app using your data 

If you would like to try the sample app specifically fit to your usage, you can do so by replacing the default sample app ID with yours, which you can obtain by [creating your Sendbird application from the dashboard](https://sendbird.com/docs/chat/v3/javascript/getting-started/install-chat-sdk#2-step-1-create-a-sendbird-application-from-your-dashboard). Furthermore, you could also add data of your choice on the dashboard to test. This will allow you to experience the sample app with data from your Sendbird application. 

<br />

## Getting started

You can install and run Local Caching for JavaScript sample app on your system using `npm`.

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
