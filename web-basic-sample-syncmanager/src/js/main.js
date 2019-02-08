import { getVariableFromUrl, isEmpty, redirectToIndex } from './utils';
import { SendBirdAction } from './SendBirdAction';
import { SendBirdConnection } from './SendBirdConnection';
import { ChatLeftMenu } from './ChatLeftMenu';
import { Chat } from './Chat';
import { UPDATE_INTERVAL_TIME } from './const';
import { LeftListItem } from './components/LeftListItem';

import SendBirdSyncManager from 'sendbird-syncmanager';
import { Toast } from './components/Toast';

const sb = new SendBirdAction();

let chat = null;
let chatLeft = null;

const createConnectionHandler = () => {
  const manager = SendBirdSyncManager.getInstance();
  const connectionManager = new SendBirdConnection();
  connectionManager.onReconnectStarted = () => {
    Toast.start(document.body, 'Connection is lost. Trying to reconnect...');
    manager.pauseSync();
    connectionManager.channel = chat.channel;
  };
  connectionManager.onReconnectSucceeded = () => {
    chatLeft.updateUserInfo(SendBirdAction.getInstance().getCurrentUser());
    Toast.remove();
    manager.resumeSync();
  };
  connectionManager.onReconnectFailed = () => {
    connectionManager.remove();
  };
};

const updateGroupChannelTime = () => {
  setInterval(() => {
    LeftListItem.updateLastMessageTime();
  }, UPDATE_INTERVAL_TIME);
};

document.addEventListener('DOMContentLoaded', () => {
  const { userid, nickname } = getVariableFromUrl();
  if (isEmpty(userid) || isEmpty(nickname)) {
    redirectToIndex('UserID and Nickname must be required.');
  }
  
  SendBirdSyncManager.sendBird = sb.sb;
  SendBirdSyncManager.setup(userid, () => {
    chat = new Chat();
    chatLeft = new ChatLeftMenu();
    updateGroupChannelTime();
    chatLeft.loadGroupChannelList(true);

    sb
      .connect(userid, nickname)
      .then(user => {
        chatLeft.updateUserInfo(user);
        createConnectionHandler();
      })
      .catch(() => {
        Toast.start(document.body, 'Connection is not established.');
      });
  });

});
