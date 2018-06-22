# SendBird JavaScript Web Basic Sample
This is full screen chat sample like Slack using the [SendBird SDK](https://github.com/smilefam/SendBird-SDK-JavaScript) for desktop browsers.

1. [Demo](#demo)
1. [Run the sample](#run-the-sample)
1. [Customizing the sample](#customizing-the-sample)
1. [Running on localhost (Internal Devs Only)](#running-on-localhost)

## [Demo](https://sample.sendbird.com/basic)
You can try out a live demo from the link [here](https://sample.sendbird.com/basic).

> If you want to legacy basic sample used jQuery, you can find the [Legacy tag](https://github.com/smilefam/SendBird-JavaScript/tree/Legacy(WebBasic)).


## Run the sample
1. Install packages

> Require that you have Node installed.

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

> Require that you have Node installed.

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
When the modification is complete, you'll need to bundle the file using `webpack`. The bundled files are created in the `dist` folder.
Please check `webpack.config.js` for settings.

```bash
npm run build
```

## Running on localhost

To connect to your local instance first generate a tester APP_ID so that routing goes through localhost, note that you cannot just use an APP_ID from the dashboard. You will need access to the soda repository, afterwards you can run the following commands in the soda directory to retrieve the APP_ID.

```
$ python manage.py shell_plus
```

In the interactive shell enter the following commands to generate the APP_ID.

```
>>> import soda_tests.test_util as util\
>>> import time
>>> app = util.create_app("Tester App", int(time.time() * 1000))
>>> app
<Application: Tester App(FF644D70-E9D5-46F9-933F-3346833F8646)>

```

Then in src/js/SendBirdAction.js change the sb.connect() method call to use the following parameters for your API and WS server.

```
  connect(userId, nickname) {
    return new Promise((resolve, reject) => {
      const sb = SendBird.getInstance();
      sb.connect(userId, "http://api.localtest.me:9800", "ws://ws.localtest.me:9700", (user, error) =>
  }
```

Afterwards run web pack and restart your python server.

 ```
webpack -p
python -m SimpleHTTPServer 8000
```

Afterwards your app should connect to your localhost server.
