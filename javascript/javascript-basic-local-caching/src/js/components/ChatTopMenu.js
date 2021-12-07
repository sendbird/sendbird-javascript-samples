import styles from '../../scss/chat-top-menu.scss';
import { createDivEl, errorAlert, protectFromXSS } from '../utils';
import { Chat } from '../Chat';
import { UserList } from './UserList';
import { SendBirdAction } from '../SendBirdAction';

class ChatTopMenu {
  constructor(channel) {
    this.channel = channel;
    this.element = this._createElement(channel);
  }

  get chatTitle() {
    return this.channel.members
      .map(member => {
        return protectFromXSS(member.nickname);
      })
      .join(', ');
  }

  _createElement(channel) {
    const root = createDivEl({ className: styles['chat-top'] });

    this.title = createDivEl({
      className: [styles['chat-title'], styles['is-group']],
      content: this.chatTitle
    });
    root.appendChild(this.title);

    const button = createDivEl({ className: styles['chat-button'] });
    const invite = createDivEl({ className: styles['button-invite'] });
    invite.addEventListener('click', () => {
      UserList.getInstance().render(true);
    });
    button.appendChild(invite);
    const hide = createDivEl({ className: styles['button-hide'] });
    hide.addEventListener('click', () => {
      SendBirdAction.getInstance()
        .hide(channel.url)
        .then(() => {
          // ChatLeftMenu.getInstance().removeGroupChannelItem(this.channel.url);
          Chat.getInstance().renderEmptyElement();
        })
        .catch(error => {
          errorAlert(error.message);
        });
    });
    button.appendChild(hide);

    const leave = createDivEl({ className: styles['button-leave'] });
    leave.addEventListener('click', () => {
      SendBirdAction.getInstance()
        .leave(channel.url)
        .then(() => {
          // ChatLeftMenu.getInstance().removeGroupChannelItem(this.channel.url);
          Chat.getInstance().renderEmptyElement();
        })
        .catch(error => {
          errorAlert(error.message);
        });
    });
    button.appendChild(leave);
    root.appendChild(button);
    return root;
  }

  updateTitle(channel) {
    this.channel = channel;
    this.title.innerHTML = this.chatTitle;
  }
}

export { ChatTopMenu };
