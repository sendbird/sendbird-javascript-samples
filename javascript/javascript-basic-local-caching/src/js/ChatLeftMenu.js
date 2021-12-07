import { LeftListItem } from './components/LeftListItem';
import { ACTIVE_CLASSNAME, DISPLAY_BLOCK, DISPLAY_NONE } from './const';
import { addClass, isScrollBottom, isUrl, protectFromXSS, removeClass, findChannelIndex } from './utils';
import { SendBirdAction } from './SendBirdAction';
import { UserList } from './components/UserList';
import { Chat } from './Chat';

let instance = null;

class ChatLeftMenu {
  constructor() {
    if (instance) {
      return instance;
    }
    this.activeChannelUrl = null;

    const action = new SendBirdAction();
    const sb = action.sb;
    const groupChannelFilter = new sb.GroupChannelFilter();
    groupChannelFilter.includeEmpty = false;
    this.channelCollection = sb.GroupChannel.createGroupChannelCollection()
      .setOrder(sb.GroupChannelCollection.GroupChannelOrder.ORDER_LATEST_LAST_MESSAGE)
      .setFilter(groupChannelFilter)
      .setLimit(50)
      .build();
    this.channelCollection.setGroupChannelCollectionHandler({
      onChannelsAdded: (context, channels) => {
        for (let i in channels) {
          const channel = channels[i];
          const index = findChannelIndex(channel, this.channelCollection.channels);
          const handler = () => {
            Chat.getInstance().render(channel, false);
            this.activeChannelUrl = channel.url;
          };
          const item = new LeftListItem({ channel, handler });
          if (index < this.groupChannelList.childNodes.length - 1) {
            this.groupChannelList.insertBefore(item.element, this.groupChannelList.childNodes[index]);
          } else {
            this.groupChannelList.appendChild(item.element);
          }
          if (this.activeChannelUrl === channel.url) {
            this.activeChannelItem(channel.url);
          }
        }
        LeftListItem.updateUnreadCount();
        this.toggleGroupChannelDefaultItem();
      },
      onChannelsUpdated: (context, channels) => {
        for (let i in channels) {
          const channel = channels[i];
          const item = this.getItem(channel.url);
          const handler = () => {
            Chat.getInstance().render(channel, false);
            this.activeChannelUrl = channel.url;
          };
          const newItem = new LeftListItem({ channel, handler });
          this.groupChannelList.replaceChild(newItem.element, item);
          if (this.activeChannelUrl === channel.url) {
            this.activeChannelItem(channel.url);
          }
        }
        LeftListItem.updateUnreadCount();
      },
      onChannelsDeleted: (context, channelUrls) => {
        for (let i in channelUrls) {
          const channelUrl = channelUrls[i];
          if (this.activeChannelUrl === channelUrl) {
            this.activeChannelUrl = null;
            Chat.getInstance().render();
          }
          const element = this.getItem(channelUrl);
          this.groupChannelList.removeChild(element);
        }
        this.toggleGroupChannelDefaultItem();
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
    this.channelCollection.loadMore().then(channels => {
      for (let channel of channels) {
        const handler = () => {
          Chat.getInstance().render(channel, false);
          this.activeChannelUrl = channel.url;
        };
        const item = new LeftListItem({ channel, handler });
        this.groupChannelList.appendChild(item.element);
      }
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
