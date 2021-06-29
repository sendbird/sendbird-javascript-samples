import { getVariableFromUrl, isEmpty, redirectToIndex } from './utils';
import { SendBirdAction } from './SendBirdAction';
import { ChatLeftMenu } from './ChatLeftMenu';
import { Chat } from './Chat';
import { Spinner } from './components/Spinner';
import { body, UPDATE_INTERVAL_TIME } from './const';
import { SendBirdConnection } from './SendBirdConnection';
import { SendBirdEvent } from './SendBirdEvent';
import { LeftListItem } from './components/LeftListItem';

const sb = new SendBirdAction();

const chatLeft = new ChatLeftMenu();
const chat = new Chat();

Spinner.start(body);

const createConnectionHandler = () => {
  const connectionManager = new SendBirdConnection();
  connectionManager.onReconnectStarted = () => {
    Spinner.start(body);
    console.log('[SendBird JS SDK] Reconnect : Started');
    connectionManager.channel = chat.channel;
  };
  connectionManager.onReconnectSucceeded = () => {
    console.log('[SendBird JS SDK] Reconnect : Succeeded');
    chatLeft.clear();
    chatLeft.updateUserInfo(SendBirdAction.getInstance().getCurrentUser());
    chatLeft.getGroupChannelList(true);
    Spinner.start(body);
    chat.refresh(connectionManager.channel);
  };
  connectionManager.onReconnectFailed = () => {
    console.log('[SendBird JS SDK] Reconnect : Failed');
    connectionManager.remove();
    redirectToIndex('SendBird Reconnect Failed...');
  };
};

const createChannelEvent = () => {
  const channelEvent = new SendBirdEvent();
  channelEvent.onChannelChanged = channel => {
    if(channel._autoMarkAsRead) {
      channel.markAsRead();
    }
    chatLeft.updateItem(channel, true);
  };
  channelEvent.onUserEntered = (openChannel, user) => {
    if (SendBirdAction.getInstance().isCurrentUser(user)) {
      const handler = () => {
        chat.render(openChannel.url);
        ChatLeftMenu.getInstance().activeChannelItem(openChannel.url);
      };
      const item = new LeftListItem({ channel: openChannel, handler });
      chatLeft.addOpenChannelItem(item.element);
      chat.render(openChannel.url);
    }
  };
  channelEvent.onUserJoined = (groupChannel, user) => {
    const handler = () => {
      chat.render(groupChannel.url, false);
      ChatLeftMenu.getInstance().activeChannelItem(groupChannel.url);
    };
    const item = new LeftListItem({ channel: groupChannel, handler });
    chatLeft.addGroupChannelItem(item.element);
    chat.updateChatInfo(groupChannel);
  };
  channelEvent.onUserLeft = (groupChannel, user) => {
    if (SendBirdAction.getInstance().isCurrentUser(user)) {
      chatLeft.removeGroupChannelItem(groupChannel.url);
    } else {
      chatLeft.updateItem(groupChannel);
    }
    chat.updateChatInfo(groupChannel);
  };
  channelEvent.onChannelHidden = groupChannel => {
    chatLeft.removeGroupChannelItem(groupChannel.url);
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
  sb
    .connect(userid, nickname)
    .then(user => {
      chatLeft.updateUserInfo(user);
      createConnectionHandler();
      createChannelEvent();
      updateGroupChannelTime();
      chatLeft.getGroupChannelList(true);
    })
    .catch(() => {
      redirectToIndex('SendBird connection failed.');
    });
});
