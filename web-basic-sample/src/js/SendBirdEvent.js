import SendBird from 'sendbird';
import { uuid4 } from './utils';

class SendBirdEvent {
  constructor() {
    this.sb = SendBird.getInstance();
    this.key = uuid4();
    this._createChannelHandler();

    this.onChannelChanged = null;
    this.onUserJoined = null;
    this.onUserLeft = null;
    this.onChannelHidden = null;
    this.onUserEntered = null;
  }

  _createChannelHandler() {
    const handler = new this.sb.ChannelHandler();
    handler.onChannelChanged = channel => {
      if (this.onChannelChanged) {
        this.onChannelChanged(channel);
      }
    };
    handler.onUserJoined = (groupChannel, user) => {
      if (this.onUserJoined) {
        this.onUserJoined(groupChannel, user);
      }
    };
    handler.onUserLeft = (groupChannel, user) => {
      if (this.onUserLeft) {
        this.onUserLeft(groupChannel, user);
      }
    };
    handler.onChannelHidden = groupChannel => {
      if (this.onChannelHidden) {
        this.onChannelHidden(groupChannel);
      }
    };
    handler.onUserEntered = (openChannel, user) => {
      if (this.onUserEntered) {
        this.onUserEntered(openChannel, user);
      }
    };
    this.sb.addChannelHandler(this.key, handler);
  }

  remove() {
    this.sb.removeChannelHandler(this.key);
  }
}

export { SendBirdEvent };
