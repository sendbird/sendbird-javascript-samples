'use strict';

import SendBirdAdapter from './adapter.js';
import Element from './elements/element.js';
import Spinner from './elements/spinner.js';
import ChatBoard from './elements/chat-board.js';
import LoginBoard from './elements/login-board.js';
import MessageBoard from './elements/message-board.js';

const ELEMENT_ID = 'sb_chat';
const ERROR_MESSAGE_SDK = 'Please import "SendBird SDK" on first.';
const ERROR_MESSAGE_APP_ID = 'Please pass "APP_ID" when start.';
const ERROR_MESSAGE_USER_INFO = 'Please pass "USER_ID" and "NICKNAME" when start.';
const ERROR_MESSAGE_CHANNEL_URL = 'Please pass "CHANNEL_URL" when start.';
const ERROR_MESSAGE = 'Please create "sb_chat" element on first.';

const MAX_MESSAGE_COUNT = 100;

window.WebFontConfig = {
  google: { families: ['Lato:400,700'] }
};

class LiveChat {
  constructor() {}

  init(appId, arg) {
    if (!window.SendBird) {
      console.error(ERROR_MESSAGE_SDK);
      return;
    }
    if (!appId) {
      console.error(ERROR_MESSAGE_APP_ID);
      return;
    }
    switch(arg.type) {
    case "channel":
      if(!arg.data.channelUrl) {
        console.error(ERROR_MESSAGE_CHANNEL_URL);
        return;
      }
      break;
    case "user":
      if(!arg.data.userId || !arg.data.nickname) {
        console.error(ERROR_MESSAGE_USER_INFO);
        return;
      }
      break;
    }
    this.loadGoogleFont();

    let _this = this;
    this.$chat = new Element(document.getElementById(ELEMENT_ID));
    if (this.$chat) {
      this.adapter = new SendBirdAdapter(appId);
      this.$spinner = new Spinner();
      this.$chatBoard = new ChatBoard(this.$chat);
      this.$messageBoard = new MessageBoard();

      this.$messageBoard.$content.on('scroll', (e) => {
        if(_this.$messageBoard.$content.getScrollY() === 0) {
          _this.adapter.getMessageList((messageList) => {
            _this.$messageBoard.render(messageList, false, true);
          });
        }
        if(_this.$messageBoard.$content.isScrollBottom()) {
          _this.$messageBoard.removeBottomBar();
        }
      });

      _this.$messageBoard.$icon.on('click', () => {
        let textMessage = _this.$messageBoard.getMessage();
        _this.$messageBoard.clearInput();
        if (textMessage) {
          textMessage = textMessage.replace(/<[\/]?\s*br\s*[\/]?>/gi, "\n");
          _this.adapter.sendMessage(textMessage, (message) => {
            _this.$messageBoard.render([ message ], true, false);
            _this.clearOverflowedMessages();
          });
        }
      });
    }
  }

  start(appId, channelUrl) {
    this.init(appId, {
      'type' : 'channel',
      'data' : {
        'channelUrl' : channelUrl
      }
    });

    if (this.$chat) {
      let _this = this;
      this.$loginBoard = new LoginBoard();
      this.$loginBoard.onLogin(() => {
        if(!_this.$loginBoard.$login.hasClass("disabled")) {
          _this.$loginBoard.disable();
          _this.$spinner.attachTo(_this.$loginBoard.$login);

          _this.adapter.connect(_this.$loginBoard.$userId.val(),
            _this.$loginBoard.$nickname.val(),
            () => {
              _this.$spinner.remove(_this.$loginBoard.$login);
              _this.$loginBoard.reset();
              _this.$spinner.attachTo(_this.$messageBoard.$content);

              _this.$chatBoard.replaceElement(_this.$loginBoard, _this.$messageBoard);
              _this.adapter.connectionHandler(channelUrl, _this);
              _this.enterChannel(channelUrl);
            });
        }
      });
      this.$chatBoard.appendElement(this.$loginBoard);
    } else {
      console.error(ERROR_MESSAGE);
    }
  }

  startWithConnect(appId, userId, nickname, callback) {
    let _this = this;
    _this.init(appId, {
      'type' : 'user',
      'data' : {
        'userId' : userId,
        'nickname' : nickname
      }
    });
    if (_this.$chat) {
      _this.adapter.connect(userId, nickname, () => {
        _this.$spinner.attachTo(_this.$messageBoard.$content);
        _this.$chatBoard.appendElement(_this.$messageBoard);
        callback();
      });
    } else {
      console.error(ERROR_MESSAGE);
    }
  }

  enterChannel(channelUrl, callback) {
    let _this = this;
    _this.adapter.enterChannel(channelUrl, () => {
      _this.adapter.getMessageList((messageList) => {
        _this.$spinner.remove(_this.$messageBoard.$content);
        _this.$messageBoard.render(messageList, true, false);

        _this.adapter.createHandler((channel, message) => {
          if (channel.url === channelUrl) {
            let isBottom = _this.$messageBoard.isScrollBottom();
            _this.$messageBoard.render([message], isBottom, false);
            if (!isBottom) {
              _this.$messageBoard.createBottomBar();
            } else {
              _this.clearOverflowedMessages();
            }
          }
        });
      }, true);

      if(callback) {
        callback();
      }
    });
  }

  exitChannel(callback) {
    this.adapter.exitChannel(callback);
  }

  clearOverflowedMessages() {
    let $messages = this.$messageBoard.$content.children();
    let overCount = $messages.length - MAX_MESSAGE_COUNT;
    if (overCount > 0) {
      for(let i = 0 ; i < overCount; i++) {
        this.$messageBoard.$content.removeFirst();
      }
    }
  }

  loadGoogleFont() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  }

}

window.liveChat = new LiveChat();
