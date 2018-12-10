import { LeftListItem } from './components/LeftListItem';
import { ACTIVE_CLASSNAME, DISPLAY_BLOCK, DISPLAY_NONE } from './const';
import { addClass, isScrollBottom, isUrl, protectFromXSS, removeClass } from './utils';
import { SendBirdAction } from './SendBirdAction';
import { UserList } from './components/UserList';
import { Chat } from './Chat';
import { Spinner } from './components/Spinner';

import SyncManager from './manager/src/SyncManager';

let instance = null;

class ChatLeftMenu {
  constructor() {
    if (instance) {
      return instance;
    }
    this.activeChannelUrl = null;

    const action = new SendBirdAction();
    const query = action.sb.GroupChannel.createMyGroupChannelListQuery();
    query.limit = 50;
    query.includeEmpty = false;
    query.order = 'latest_last_message';

    const manager = new SyncManager.Channel(action.sb);
    this.channelCollection = manager.createMyGroupChannelCollection(query);
    this.channelCollection.subscribe('chat_left_menu_group_channel', changeLog => {
      const channel = changeLog.item;
      switch(changeLog.action) {
        case 'insert': {
          const index = this.channelCollection.findIndex(channel, this.channelCollection.channels);
          const handler = () => {
            Chat.getInstance().render(channel.url, false);
            this.activeChannelUrl = channel.url;
          };
          const item = new LeftListItem({ channel, handler });
          if(index < this.groupChannelList.childNodes.length - 1) {
            this.groupChannelList.insertBefore(item.element, this.groupChannelList.childNodes[index]);
          } else {
            this.groupChannelList.appendChild(item.element);
          }
          LeftListItem.updateUnreadCount();
          this.toggleGroupChannelDefaultItem();
          if(this.activeChannelUrl === channel.url) {
            this.activeChannelItem(channel.url);
          }
          break;
        }
        case 'update': {
          const item = this.getItem(channel.url);
          const handler = () => {
            Chat.getInstance().render(channel.url, false);
            this.activeChannelUrl = channel.url;
          };
          const newItem = new LeftListItem({ channel, handler });
          this.groupChannelList.replaceChild(newItem.element, item);
          if(this.activeChannelUrl === channel.url) {
            this.activeChannelItem(channel.url);
          }
          LeftListItem.updateUnreadCount();
          break;
        }
        case 'move': {
          const previousElement = this.getItem(channel.url);
          this.groupChannelList.removeChild(previousElement);

          const handler = () => {
            channel.markAsRead();
            Chat.getInstance().render(channel.url, false);
            this.activeChannelUrl = channel.url;
          };
          const newItem = new LeftListItem({ channel, handler });
          const index = this.channelCollection.findIndex(channel, this.channelCollection.channels);
          if(index < this.groupChannelList.childNodes.length - 1) {
            this.groupChannelList.insertBefore(newItem.element, this.groupChannelList.childNodes[index]);
          } else {
            this.groupChannelList.appendChild(newItem.element);
          }
          if(this.activeChannelUrl === channel.url) {
            this.activeChannelItem(channel.url);
          }
          LeftListItem.updateUnreadCount();
          break;
        }
        case 'remove': {
          if(this.activeChannelUrl === channel.url) {
            this.activeChannelUrl = null;
            Chat.getInstance().render();
          }
          const element = this.getItem(channel.url);
          this.groupChannelList.removeChild(element);
          this.toggleGroupChannelDefaultItem();
          break;
        }
        case 'clear': {
          if(this.activeChannelUrl) {
            Chat.getInstance().render();
          }
          this.activeChannelUrl = null;
          const elements = this.groupChannelList.getElementsByClassName(LeftListItem.getItemRootClassName());
          for (let i in elements) {
            this.groupChannelList.removeChild(elements[i]);
          }
          this.toggleGroupChannelDefaultItem();
          break;
        }
      }
    });

    this.groupChannelList = document.getElementById('group_list');
    this.groupChannelList.addEventListener('scroll', () => {
      if (isScrollBottom(this.groupChannelList)) {
        this.loadGroupChannelList();
      }
    });
    this.groupChannelDefaultItem = document.getElementById('default_item_group');
    
    const groupChannelCreateBtn = document.getElementById('group_chat_add');
    groupChannelCreateBtn.addEventListener('click', () => {
      UserList.getInstance().render();
    });
    instance = this;
  }

  updateUserInfo(user) {
    const userInfoEl = document.getElementById('user_info');
    const profileEl = userInfoEl.getElementsByClassName('image-profile')[0];
    if (isUrl(user.profileUrl)) {
      profileEl.setAttribute('src', protectFromXSS(user.profileUrl));
    }
    const nicknameEl = userInfoEl.getElementsByClassName('nickname-content')[0];
    nicknameEl.innerHTML = protectFromXSS(user.nickname);
  }

  loadGroupChannelList() {
    Spinner.start(document.body);
    this.channelCollection.loadChannels(() => {
      Spinner.remove();
      this.toggleGroupChannelDefaultItem();
    });
  }
  getItem(elementId) {
    const groupChannelItems = this.groupChannelList.getElementsByClassName(LeftListItem.getItemRootClassName());
    for (let i = 0; i < groupChannelItems.length; i++) {
      if (groupChannelItems[i].id === elementId) {
        return groupChannelItems[i];
      }
    }
    return null;
  }
  activeChannelItem(channelUrl) {
    const groupItems = this.groupChannelList.getElementsByClassName(LeftListItem.getItemRootClassName());
    for (let i = 0; i < groupItems.length; i++) {
      groupItems[i].id === channelUrl
        ? addClass(groupItems[i], ACTIVE_CLASSNAME)
        : removeClass(groupItems[i], ACTIVE_CLASSNAME);
    }
  }
  toggleGroupChannelDefaultItem() {
    this.groupChannelList.getElementsByClassName(LeftListItem.getItemRootClassName()).length > 0
      ? (this.groupChannelDefaultItem.style.display = DISPLAY_NONE)
      : (this.groupChannelDefaultItem.style.display = DISPLAY_BLOCK);
  }

  static getInstance() {
    return new ChatLeftMenu();
  }
}

export { ChatLeftMenu };
