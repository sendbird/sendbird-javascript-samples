import { LeftListItem } from './components/LeftListItem';
import { ACTIVE_CLASSNAME, body, DISPLAY_BLOCK, DISPLAY_NONE } from './const';
import { addClass, appendToFirst, errorAlert, isScrollBottom, isUrl, protectFromXSS, removeClass } from './utils';
import { Spinner } from './components/Spinner';
import { OpenChannelList } from './components/OpenChannelList';
import { SendBirdAction } from './SendBirdAction';
import { UserList } from './components/UserList';
import { Chat } from './Chat';
import { OpenChannelCreateModal } from './components/OpenChannelCreateModal';

const openChannelBtn = document.querySelector('#open_chat');
const openChannelCreateBtn = document.querySelector('#open_chat_add');
const groupChannelCreateBtn = document.querySelector('#group_chat_add');

let instance = null;

class ChatLeftMenu {
  constructor() {
    if (instance) {
      return instance;
    }

    this.openChannelList = document.getElementById('open_list');
    this.openChannelDefaultItem = document.getElementById('default_item_open');
    this.groupChannelList = document.getElementById('group_list');
    this.groupChannelList.addEventListener('scroll', () => {
      if (isScrollBottom(this.groupChannelList)) {
        this.getGroupChannelList();
      }
    });
    this.groupChannelDefaultItem = document.getElementById('default_item_group');
    this._addEvent();
    instance = this;
  }

  _addEvent() {
    openChannelBtn.addEventListener('click', () => {
      OpenChannelList.getInstance().render();
    });

    openChannelCreateBtn.addEventListener('click', () => {
      const title = 'Create Open Channel';
      const description =
        'Open Channel is a public chat. In this channel type, anyone can enter and participate in the chat without permission.';
      const submitText = 'CREATE';
      const openChannelCreateModal = new OpenChannelCreateModal({ title, description, submitText });
      openChannelCreateModal.render();
    });

    groupChannelCreateBtn.addEventListener('click', () => {
      UserList.getInstance().render();
    });
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

  /**
   * Item
   */
  getChannelItem(channelUrl) {
    const openItems = this.openChannelList.getElementsByClassName(LeftListItem.getItemRootClassName());
    const groupItems = this.groupChannelList.getElementsByClassName(LeftListItem.getItemRootClassName());
    const checkList = [...openItems, ...groupItems];
    for (let i = 0; i < checkList.length; i++) {
      if (checkList[i].id === channelUrl) {
        return checkList[i];
      }
    }
    return null;
  }

  activeChannelItem(channelUrl) {
    const openItems = this.openChannelList.getElementsByClassName(LeftListItem.getItemRootClassName());
    const groupItems = this.groupChannelList.getElementsByClassName(LeftListItem.getItemRootClassName());
    const checkList = [...openItems, ...groupItems];
    for (let i = 0; i < checkList.length; i++) {
      checkList[i].id === channelUrl
        ? addClass(checkList[i], ACTIVE_CLASSNAME)
        : removeClass(checkList[i], ACTIVE_CLASSNAME);
    }
  }

  getItem(elementId) {
    const openChannelItems = this.openChannelList.getElementsByClassName(LeftListItem.getItemRootClassName());
    for (let i = 0; i < openChannelItems.length; i++) {
      if (openChannelItems[i].id === elementId) {
        return openChannelItems[i];
      }
    }

    const groupChannelItems = this.groupChannelList.getElementsByClassName(LeftListItem.getItemRootClassName());
    for (let i = 0; i < groupChannelItems.length; i++) {
      if (groupChannelItems[i].id === elementId) {
        return groupChannelItems[i];
      }
    }

    return null;
  }

  updateItem(channel, isFirst = false) {
    const item = this.getItem(channel.url);
    const handler = () => {
      Chat.getInstance().render(channel.url, false);
      ChatLeftMenu.getInstance().activeChannelItem(channel.url);
    };
    const newItem = new LeftListItem({ channel, handler });
    const parentNode = this.groupChannelList;
    if (isFirst) {
      if (item) {
        parentNode.removeChild(item);
      }
      appendToFirst(parentNode, newItem.element);
    } else {
      parentNode.replaceChild(newItem.element, item);
    }
    LeftListItem.updateUnreadCount();
  }

  /**
   * Open Channel
   */
  toggleOpenChannelDefaultItem() {
    this.openChannelList.getElementsByClassName(LeftListItem.getItemRootClassName()).length > 0
      ? (this.openChannelDefaultItem.style.display = DISPLAY_NONE)
      : (this.openChannelDefaultItem.style.display = DISPLAY_BLOCK);
  }

  addOpenChannelItem(element) {
    if (!this.openChannelList.contains(element)) {
      this.openChannelList.appendChild(element);
    }
    this.toggleOpenChannelDefaultItem();
  }

  removeOpenChannelItem(elementId) {
    const removeEl = this.getItem(elementId);
    if (removeEl) {
      this.openChannelList.removeChild(removeEl);
    }
    this.toggleOpenChannelDefaultItem();
  }

  /**
   * Group Channel
   */
  getGroupChannelList(isInit = false) {
    Spinner.start(body);
    SendBirdAction.getInstance()
      .getGroupChannelList(isInit)
      .then(groupChannelList => {
        this.toggleGroupChannelDefaultItem(groupChannelList);
        groupChannelList.forEach(channel => {
          const handler = () => {
            Chat.getInstance().render(channel.url, false);
            ChatLeftMenu.getInstance().activeChannelItem(channel.url);
          };
          const item = new LeftListItem({ channel, handler });
          this.groupChannelList.appendChild(item.element);
          LeftListItem.updateUnreadCount();
        });
        Spinner.remove();
      })
      .catch(error => {
        errorAlert(error.message);
      });
  }

  toggleGroupChannelDefaultItem(items) {
    if (items) {
      this.groupChannelDefaultItem.style.display = items && items.length > 0 ? DISPLAY_NONE : DISPLAY_BLOCK;
    } else {
      this.groupChannelList.getElementsByClassName(LeftListItem.getItemRootClassName()).length > 0
        ? (this.groupChannelDefaultItem.style.display = DISPLAY_NONE)
        : (this.groupChannelDefaultItem.style.display = DISPLAY_BLOCK);
    }
  }

  addGroupChannelItem(element, isFirst = false) {
    const listItems = this.groupChannelList.childNodes;
    let isExist = false;
    for (let i = 0; i < listItems.length; i++) {
      if (listItems[i].id === element.id) {
        isExist = true;
      }
    }
    if (isExist) {
      SendBirdAction.getInstance()
        .getChannel(element.id, false)
        .then(channel => {
          this.updateItem(channel);
        })
        .catch(error => {
          errorAlert(error.message);
        });
    } else {
      if (isFirst) {
        appendToFirst(this.groupChannelList, element);
      } else {
        this.groupChannelList.appendChild(element);
      }
    }
    LeftListItem.updateUnreadCount();
    this.toggleGroupChannelDefaultItem();
  }

  removeGroupChannelItem(elementId) {
    const removeEl = this.getItem(elementId);
    if (removeEl) {
      this.groupChannelList.removeChild(removeEl);
    }
    this.toggleGroupChannelDefaultItem();
  }

  clear() {
    const openItems = this.openChannelList.getElementsByClassName(LeftListItem.getItemRootClassName());
    const groupItems = this.groupChannelList.getElementsByClassName(LeftListItem.getItemRootClassName());
    const removeItems = [...openItems, ...groupItems];
    for (let i = 0; i < removeItems.length; i++) {
      removeItems[i].parentNode.removeChild(removeItems[i]);
    }
    this.toggleOpenChannelDefaultItem();
    this.toggleGroupChannelDefaultItem();
  }

  static getInstance() {
    return new ChatLeftMenu();
  }
}

export { ChatLeftMenu };
