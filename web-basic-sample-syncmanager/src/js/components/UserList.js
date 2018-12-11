import styles from '../../scss/user-list.scss';
import { createDivEl, errorAlert, appendToFirst } from '../utils';
import { List } from './List';
import { Spinner } from './Spinner';
import { SendBirdAction } from '../SendBirdAction';
import { UserItem } from './UserItem';
import { Chat } from '../Chat';
import { ChatLeftMenu } from '../ChatLeftMenu';

let instance = null;

class UserList extends List {
  constructor() {
    super('User List');
    if (instance) {
      return instance;
    }

    this.scrollEventHandler = this._getUserList;
    this.closeEventHandler = this._close;
    this.createBtn = this._addCreateBtn();
    this.selectedUserIds = [];
    instance = this;
  }

  _addCreateBtn() {
    const createBtn = createDivEl({ className: styles['button-create'], content: 'CREATE' });
    const oldCreateBtn = this.buttonRootElement.getElementsByClassName(styles['button-create'])[0];
    if (oldCreateBtn) {
      this.buttonRootElement.removeChild(oldCreateBtn);
    }
    appendToFirst(this.buttonRootElement, createBtn);
    return createBtn;
  }

  _createChannel() {
    SendBirdAction.getInstance()
    .createGroupChannel(this.selectedUserIds)
    .then(channel => {
        ChatLeftMenu.getInstance().activeChannelUrl = channel.url;
        Chat.getInstance().render(channel.url, false);
        Spinner.remove();
        this.close();
      })
      .catch(error => {
        errorAlert(error.message);
      });
  }

  _inviteChannel() {
    const channelUrl = Chat.getInstance().channel.url;
    SendBirdAction.getInstance()
      .inviteGroupChannel(channelUrl, this.selectedUserIds)
      .then(() => {
        Spinner.remove();
        this.close();
      })
      .catch(error => {
        errorAlert(error.message);
      });
  }

  _updateCreateType(isInvite) {
    this.createBtn = this._addCreateBtn();
    this.createBtn.innerHTML = isInvite ? 'INVITE' : 'CREATE';
    this.createBtn.addEventListener('click', () => {
      Spinner.start(this.element);
      if (isInvite) {
        this._inviteChannel();
      } else {
        this._createChannel();
      }
    });
  }

  _getUserList(isInit = false) {
    Spinner.start(this.element);
    const sendbirdAction = SendBirdAction.getInstance();
    const listContent = this.getContentElement();
    sendbirdAction
      .getUserList(isInit)
      .then(userList => {
        userList.forEach(user => {
          if (!sendbirdAction.isCurrentUser(user)) {
            const handler = () => {
              this._toggleUserId(item.userId);
            };
            const item = new UserItem({ user, handler });
            listContent.appendChild(item.element);
          }
        });
        Spinner.remove();
      })
      .catch(error => {
        errorAlert(error.message);
      });
  }

  _toggleUserId(userId) {
    const index = this.selectedUserIds.indexOf(userId);
    if (index > -1) {
      this.selectedUserIds.splice(index, 1);
    } else {
      this.selectedUserIds.push(userId);
    }
  }

  _close() {
    this.selectedUserIds = [];
  }

  render(isInvite = false) {
    if (!document.body.querySelector(`.${this.getRootClassName()}`)) {
      this._updateCreateType(isInvite);
      document.body.appendChild(this.element);
      this._getUserList(true);
    }
  }

  static getInstance() {
    return new UserList();
  }
}

export { UserList };
