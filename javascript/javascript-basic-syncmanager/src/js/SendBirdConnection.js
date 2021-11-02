import { uuid4 } from './utils';
import SendBird from 'sendbird';
import { Chat } from './Chat';

let instance = null;

class SendBirdConnection {
  constructor() {
    if (instance) {
      return instance;
    }

    this.sb = SendBird.getInstance();
    this.key = uuid4();
    this.channel = null;
    this._createConnectionHandler(this.key);
    this.chat = Chat.getInstance();

    this.onReconnectStarted = null;
    this.onReconnectSucceeded = null;
    this.onReconnectFailed = null;

    instance = this;
  }

  _createConnectionHandler(key) {
    const handler = new this.sb.ConnectionHandler();
    handler.onReconnectStarted = () => {
      if (this.chat && this.chat.main) {
        this.chat.main.body.stopSpinner();
      }
      if (this.onReconnectStarted) {
        this.onReconnectStarted();
      }
    };
    handler.onReconnectSucceeded = () => {
      if (this.onReconnectSucceeded) {
        this.onReconnectSucceeded();
      }
    };
    handler.onReconnectFailed = () => {
      if (this.onReconnectFailed) {
        this.onReconnectFailed();
      }
    };
    this.sb.addConnectionHandler(key, handler);
  }

  remove() {
    this.sb.removeConnectionHandler(this.key);
  }

  reconnect() {
    this.sb.reconnect();
  }

  static getInstance() {
    return new SendBirdConnection();
  }
}

export { SendBirdConnection };
