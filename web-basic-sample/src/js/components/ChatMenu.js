import styles from '../../scss/chat-menu.scss';
import { appendToFirst, createDivEl, errorAlert, isScrollBottom } from '../utils';
import { DISPLAY_FLEX, DISPLAY_NONE } from '../const';
import { Spinner } from './Spinner';
import { ChatUserItem } from './ChatUserItem';
import { SendBirdAction } from '../SendBirdAction';

const Type = {
  PARTICIPANTS: 'PARTICIPANTS',
  MEMBERS: 'MEMBERS',
  BLOCKED: 'BLOCKED'
};

class ChatMenu {
  constructor(channel) {
    this.channel = channel;
    this.element = createDivEl({ className: styles['chat-menu-root'] });
    this.listElement = null;
    this.type = null;
    this._createListElement();
    this._createElement();
  }

  _createListElement() {
    this.listElement = createDivEl({ className: styles['menu-list'] });

    const title = createDivEl({ className: styles['list-title'] });
    title.addEventListener('click', () => {
      this.type = null;
      this.list.innerHTML = '';
      this.listElement.style.display = DISPLAY_NONE;
    });
    this.listElement.appendChild(title);
    const backBtn = createDivEl({ className: styles['list-back'] });
    title.appendChild(backBtn);
    this.titleText = createDivEl({ className: styles['list-text'] });
    title.appendChild(this.titleText);

    this.list = createDivEl({ className: styles['list-body'] });
    this.list.addEventListener('scroll', () => {
      if (this.type === Type.PARTICIPANTS) {
        if (isScrollBottom(this.list)) {
          this._getParticipantList(this.type);
        }
      } else if (this.type === Type.BLOCKED) {
        this._getBlockedList(this.type);
      }
    });
    this.listElement.appendChild(this.list);

    this.element.appendChild(this.listElement);
  }

  _createElement() {
    const usersItem = createDivEl({ className: styles['menu-item'] });
    const users = createDivEl({
      className: styles['menu-users'],
      content: this.channel.isOpenChannel() ? Type.PARTICIPANTS : Type.MEMBERS
    });
    usersItem.appendChild(users);
    const arrowUser = createDivEl({ className: styles['menu-arrow'] });
    usersItem.appendChild(arrowUser);
    usersItem.addEventListener('click', () => {
      this._renderList(users.textContent);
    });
    this.element.appendChild(usersItem);

    const blockedItem = createDivEl({ className: styles['menu-item'] });
    const blocked = createDivEl({ className: styles['menu-blocked'], content: Type.BLOCKED });
    blockedItem.appendChild(blocked);
    const arrowBlocked = createDivEl({ className: styles['menu-arrow'] });
    blockedItem.appendChild(arrowBlocked);
    blockedItem.addEventListener('click', () => {
      this._renderList(blocked.textContent);
    });
    this.element.appendChild(blockedItem);
  }

  _renderList(listTitle) {
    switch (listTitle) {
      case Type.PARTICIPANTS:
        this.type = Type.PARTICIPANTS;
        this._getParticipantList(listTitle, true);
        break;
      case Type.MEMBERS:
        this.type = Type.MEMBERS;
        this._getMemberList(listTitle);
        break;
      case Type.BLOCKED:
        this.type = Type.BLOCKED;
        this._getBlockedList(listTitle, true);
        break;
      default:
        this.titleText.innerHTML = '';
        break;
    }
  }

  _getParticipantList(listTitle, isInit = false) {
    if (this.channel.isOpenChannel()) {
      Spinner.start(this.listElement);
      if (isInit) {
        this.titleText.innerHTML = listTitle;
        this.listElement.style.display = DISPLAY_FLEX;
      }
      SendBirdAction.getInstance()
        .getParticipantList(this.channel.url, isInit)
        .then(participantList => {
          participantList.forEach(user => {
            const participantItem = new ChatUserItem({ user, hasEvent: false });
            this.list.appendChild(participantItem.element);
          });
          Spinner.remove();
        })
        .catch(error => {
          errorAlert(error.message);
        });
    }
  }

  _getMemberList(listTitle) {
    if (this.channel.isGroupChannel()) {
      Spinner.start(this.listElement);
      this.list.innerHTML = '';
      this.titleText.innerHTML = listTitle;
      this.listElement.style.display = DISPLAY_FLEX;
      this.channel.members.forEach(user => {
        const memberItem = new ChatUserItem({ user, hasEvent: false });
        this.list.appendChild(memberItem.element);
      });
      Spinner.remove();
    }
  }

  _getBlockedList(listTitle, isInit = false) {
    Spinner.start(this.listElement);
    if (isInit) {
      this.list.innerHTML = '';
      this.titleText.innerHTML = listTitle;
      this.listElement.style.display = DISPLAY_FLEX;
    }
    SendBirdAction.getInstance()
      .getBlockedList(isInit)
      .then(blockedList => {
        blockedList.forEach(user => {
          const blockedItem = new ChatUserItem({ user, hasEvent: true });
          this.list.appendChild(blockedItem.element);
        });
        Spinner.remove();
      })
      .catch(error => {
        errorAlert(error.message);
      });
  }

  updateBlockedList(user, isBlock) {
    if (this.list) {
      if (isBlock) {
        const blockedItem = new ChatUserItem({ user, hasEvent: true });
        appendToFirst(this.list, blockedItem.element);
      } else {
        const items = this.list.childNodes;
        for (let i = 0; i < items.length; i++) {
          if (items[0].id === user.userId) {
            this.list.removeChild(items[0]);
            break;
          }
        }
      }
    }
  }

  updateMenu(channel) {
    if (this.type === Type.MEMBERS) {
      this.channel = channel;
      this._getMemberList(this.type);
    }
  }

  static get Type() {
    return Type;
  }
}

export { ChatMenu };
