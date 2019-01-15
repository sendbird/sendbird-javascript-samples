# SendBird JavaScript Web Basic Sample with SyncManager
This is full screen chat sample like Slack using [SendBird SDK](https://github.com/smilefam/SendBird-SDK-JavaScript) for desktop browsers. SyncManager is included and applied.

- [SendBird JavaScript Web Basic Sample with SyncManager](#sendbird-javascript-web-basic-sample-with-syncmanager)
  - [SyncManager](#syncmanager)
  - [Demo](#demo)
  - [Run the sample](#run-the-sample)
  - [Customizing the sample](#customizing-the-sample)

## SyncManager

`SyncManager` is a support add-on for [SendBird SDK](https://github.com/smilefam/SendBird-SDK-JavaScript). Major benefits of `SyncManager` are,

 * Local cache integrated: store channel/message data in local storage for fast view loading.
 * Event-driven data handling: subscribe channel/message event like `insert`, `update`, `remove` at a single spot in order to apply data event to view.

Check out [Basic Sample with SyncManager](https://github.com/smilefam/SendBird-JavaScript/tree/master/web-basic-sample-syncmanager) which is same as [Basic Sample](https://sample.sendbird.com/basic) with `SyncManager` integrated.  
For more information about `SyncManager`, please refer to [SyncManager README](https://github.com/smilefam/SendBird-JavaScript/blob/master/web-basic-sample-syncmanager/src/js/manager/README.md).

## Demo
You can try out a live demo from the link [here](https://sample.sendbird.com/basic/sync-manager).

## Run the sample
1. Install packages

> Require that you have Node v8.x+ installed.

```bash
npm install
```

2. Run

```bash
npm start
```

## Customizing the sample
If you want to put some changes into the sample, you should build it using `webpack`.  

1. Install packages

> Require that you have Node.js v8.x+ installed.

```bash
npm install
``` 

2. Modify files
If you want to change `APP_ID`, change `APP_ID` in const.js to the other `APP_ID` you want.  
You can test the sample with local server by running the following command.  

```bash
npm run start:dev
``` 

3. Build the sample
When the modification is complete, you'll need to bundle the file using `webpack`. The bundled files are created in the `dist` folder. Please check `webpack.config.js` for settings.    

```bash
npm run build
```

> The `npm start` command contains `npm run build`. Check the scripts part of the package.json file.
