import { getVariableFromUrl, isEmpty, redirectToIndex } from './utils';
import { SendBirdAction } from './SendBirdAction';
import { SendBirdConnection } from './SendBirdConnection';
import { ChatLeftMenu } from './ChatLeftMenu';
import { Chat } from './Chat';
import { UPDATE_INTERVAL_TIME } from './const';
import { LeftListItem } from './components/LeftListItem';

import { Toast } from './components/Toast';

const sb = new SendBirdAction();

let chat = null;
let chatLeft = null;

const createConnectionHandler = () => {
  const connectionManager = new SendBirdConnection();
  connectionManager.onReconnectStarted = () => {
    Toast.start(document.body, 'Connection is lost. Trying to reconnect...');
    connectionManager.channel = chat.channel;
  };
  connectionManager.onReconnectSucceeded = () => {
    chatLeft.updateUserInfo(SendBirdAction.getInstance().getCurrentUser());
    Toast.remove();
  };
  connectionManager.onReconnectFailed = () => {
    connectionManager.reconnect();
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

  sb.connect(userid, nickname)
    .then(user => {
      chat = new Chat();
      chatLeft = new ChatLeftMenu();
      chatLeft.updateUserInfo(user);
      updateGroupChannelTime();
      chatLeft.loadGroupChannelList(true);
      createConnectionHandler();
    })
    .catch(() => {
      Toast.start(document.body, 'Connection is not established.');
    });
});
