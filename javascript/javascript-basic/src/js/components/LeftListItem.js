import styles from '../../scss/list-item.scss';
import {
  addClass,
  createDivEl,
  getDataInElement,
  protectFromXSS,
  removeClass,
  setDataInElement,
  timestampFromNow
} from '../utils';
import { ChatLeftMenu } from '../ChatLeftMenu';

const KEY_MESSAGE_LAST_TIME = 'origin';

class LeftListItem {
  constructor({ channel, handler }) {
    this.channel = channel;
    this.element = this._createElement(handler);
  }

  get channelUrl() {
    return this.channel.url;
  }

  get title() {
    return this.channel.isOpenChannel()
      ? `# ${this.channel.name}`
      : this.channel.members
          .map(member => {
            return protectFromXSS(member.nickname);
          })
          .join(', ');
  }

  get lastMessagetime() {
    if (this.channel.isOpenChannel() || !this.channel.lastMessage) {
      return 0;
    } else {
      return this.channel.lastMessage.createdAt;
    }
  }

  get lastMessageTimeText() {
    if (this.channel.isOpenChannel() || !this.channel.lastMessage) {
      return 0;
    } else {
      return LeftListItem.getTimeFromNow(this.channel.lastMessage.createdAt);
    }
  }

  get lastMessageText() {
    if (this.channel.isOpenChannel() || !this.channel.lastMessage) {
      return '';
    } else {
      return this.channel.lastMessage.isFileMessage()
        ? protectFromXSS(this.channel.lastMessage.name)
        : protectFromXSS(this.channel.lastMessage.message);
    }
  }

  get memberCount() {
    return this.channel.isOpenChannel() ? '#' : this.channel.memberCount;
  }

  get unreadMessageCount() {
    const count = this.channel.unreadMessageCount > 9 ? '+9' : this.channel.unreadMessageCount.toString();
    return this.channel.isOpenChannel() ? 0 : count;
  }

  _createElement(handler) {
    const item = createDivEl({ className: styles['list-item'], id: this.channelUrl });
    if (this.channel.isOpenChannel()) {
      const itemTop = createDivEl({ className: styles['item-top'] });
      const itemTopTitle = createDivEl({ className: styles['item-title'], content: this.title });
      itemTop.appendChild(itemTopTitle);
      item.appendChild(itemTop);
    } else {
      const itemTop = createDivEl({ className: styles['item-top'] });
      const itemTopCount = createDivEl({ className: styles['item-count'], content: this.memberCount });
      const itemTopTitle = createDivEl({ className: styles['item-title'], content: this.title });
      itemTop.appendChild(itemTopCount);
      itemTop.appendChild(itemTopTitle);
      item.appendChild(itemTop);

      const itemBottom = createDivEl({ className: styles['item-bottom'] });

      const itemBottomMessage = createDivEl({ className: styles['item-message'] });
      const itemBottomMessageText = createDivEl({
        className: styles['item-message-text'],
        content: this.lastMessageText
      });
      itemBottomMessage.appendChild(itemBottomMessageText);
      const itemBottomMessageUnread = createDivEl({
        className: [styles['item-message-unread'], styles.active],
        content: this.unreadMessageCount
      });
      itemBottomMessage.appendChild(itemBottomMessageUnread);

      const itemBottomTime = createDivEl({ className: styles['item-time'], content: this.lastMessageTimeText });
      setDataInElement(itemBottomTime, KEY_MESSAGE_LAST_TIME, this.lastMessagetime);
      itemBottom.appendChild(itemBottomMessage);
      itemBottom.appendChild(itemBottomTime);
      item.appendChild(itemBottom);
    }

    item.addEventListener('click', () => {
      if (handler) handler();
    });
    return item;
  }

  static updateUnreadCount() {
    const items = ChatLeftMenu.getInstance().groupChannelList.getElementsByClassName(styles['item-message-unread']);
    if (items && items.length > 0) {
      Array.prototype.slice.call(items).forEach(targetItemEl => {
        const originTs = targetItemEl.textContent;
        if (originTs === '0') {
          removeClass(targetItemEl, styles.active);
        } else {
          addClass(targetItemEl, styles.active);
        }
      });
    }
  }

  static updateLastMessageTime() {
    const items = ChatLeftMenu.getInstance().groupChannelList.getElementsByClassName(styles['item-time']);
    if (items && items.length > 0) {
      Array.prototype.slice.call(items).forEach(targetItemEl => {
        const originTs = parseInt(getDataInElement(targetItemEl, KEY_MESSAGE_LAST_TIME));
        if (originTs) {
          targetItemEl.innerHTML = LeftListItem.getTimeFromNow(originTs);
        }
      });
    }
  }

  static getTimeFromNow(timestamp) {
    return timestampFromNow(timestamp);
  }

  static getItemRootClassName() {
    return styles['list-item'];
  }
}

export { LeftListItem };
