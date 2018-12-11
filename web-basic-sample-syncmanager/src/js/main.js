import { getVariableFromUrl, isEmpty, redirectToIndex } from './utils';
import { SendBirdAction } from './SendBirdAction';
import { SendBirdConnection } from './SendBirdConnection';
import { ChatLeftMenu } from './ChatLeftMenu';
import { Chat } from './Chat';
import { Spinner } from './components/Spinner';
import { UPDATE_INTERVAL_TIME } from './const';
import { LeftListItem } from './components/LeftListItem';

import SyncManager from './manager/src/SyncManager';

const sb = new SendBirdAction();

let chat = null;
let chatLeft = null;

const createConnectionHandler = () => {
  const connectionManager = new SendBirdConnection();
  connectionManager.onReconnectStarted = () => {
    Spinner.start(document.body);
    connectionManager.channel = chat.channel;
  };
  connectionManager.onReconnectSucceeded = () => {
    chatLeft.clear();
    chatLeft.updateUserInfo(SendBirdAction.getInstance().getCurrentUser());
    Spinner.remove();
  };
  connectionManager.onReconnectFailed = () => {
    connectionManager.remove();
    Spinner.remove();
    redirectToIndex('SendBird Reconnect Failed...');
  };
};

const updateGroupChannelTime = () => {
  setInterval(() => {
    LeftListItem.updateLastMessageTime();
  }, UPDATE_INTERVAL_TIME);
};

document.addEventListener('DOMContentLoaded', () => {
  Spinner.start(document.body);
  const { userid, nickname } = getVariableFromUrl();
  if (isEmpty(userid) || isEmpty(nickname)) {
    redirectToIndex('UserID and Nickname must be required.');
  }
  sb
    .connect(userid, nickname)
    .then(user => {
      SyncManager.init(() => {
        Spinner.remove();
  
        chat = new Chat();
        chatLeft = new ChatLeftMenu();
        chatLeft.updateUserInfo(user);
        createConnectionHandler();
        updateGroupChannelTime();
        chatLeft.loadGroupChannelList(true);
      });
    })
    .catch(() => {
      redirectToIndex('SendBird connection failed.');
    });
});
