# SendBird JavaScript Chat Sample
This is a sample chat built using using the [SendBird SDK](https://github.com/smilefam/SendBird-SDK-JavaScript). It can be used to add a functional chat to any website.  


## [Demo](https://sample.sendbird.com/livechat/)

You can try out a live demo from the link [here](https://sample.sendbird.com/livechat/). Choose any 'User ID' and 'Nickname' to log in and participate in chats.


## Setup
1. The `body` must have a `div` element whose id is `sb_chat`. we recommend width and height to 400px or over both.  
  
```html
<body>
  <div id="sb_chat"></div>
</body>
```

2. Import the [`SendBird SDK`](https://github.com/smilefam/SendBird-SDK-JavaScript).  
3. Import the `liveChat.SendBird.js` file.
```javascript
<script src="SendBird.min.js"></script>
<script src="build/liveChat.SendBird.js"></script>
```


## Customizing the sample
If you refresh your browser window, you need to reconnect to SendBird. To retain connection on browser refresh, you must implement an appropriate `event handler`. 

If you wish to issue an `access_token` for your user, modify the `connect function` in `src/sendbird.js`.  

1. Install npm

        npm install --save-dev

2. Modify files.
3. Create a bundle file.

        webpack -p

### Connect other APP or Channel
If you want to connect other application or channel, you need to change variable `appId` or `channelUrl` in `index.html`.

```html
...

  <script src="SendBird.min.js"></script>
  <script src="build/liveChat.SendBird.js"></script>
  <script>
    var appId = '<APP_ID>';
    var channelUrl = '<CHANNEL_URL>';
    liveChat.start(appId, channelUrl);
  </script>

</html>
```


## File Structure
```
    |-- build
        |-- liveChat.SendBird.js            - SendBird Chat Bundle file
    |-- node_modules
        |-- ...                             - (node packages)
    |-- src
        |-- js
            |-- elements  
                |-- elements.js             - elements root class
                |-- spinner.js              - spinner element
                |-- chat-board.js           - board element
                |-- login-board.js          - login element
                |-- message-board.js        - message element
            |-- consts.js                   - const variables
            |-- utils.js                    - util functions
            |-- sendbird.js                 - sendbird functions
            |-- chat.js                     - chat functions
        |-- scss
            |-- mixins 
                |-- _border-radius.scss     - border radius mixin  
                |-- _box-shadow.scss        - box shadow mixin
                |-- _state.scss             - element state mixin
                |-- _transform.scss         - transform mixin
                |-- _reset.scss             - clean css mixin
            |-- _mixins.scss                - import mixin
            |-- _variables.scss             - css variables
            |-- _animation.scss             - animation
            |-- _icons.scss                 - icon 
            |-- chat.scss                   - main css  
|-- .eslintrc.js                            - lint setting 
|-- webpack.config.js                       - webpack setting 
|-- package.json                            - npm package 
|-- SendBird.min.js                         - SendBird SDK 
|-- index.html                              - sample file
|-- README.md
```
