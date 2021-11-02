import styles from '../../scss/chat-user-item.scss';
import { createDivEl, protectFromXSS } from '../utils';
import { COLOR_RED } from '../const';
import { UserBlockModal } from './UserBlockModal';
import { SendBirdAction } from '../SendBirdAction';

class ChatUserItem {
  constructor({ user, hasEvent }) {
    this.user = user;
    this.hasEvent = hasEvent;
    this.element = null;
    this._create();
  }

  _create() {
    this.element = createDivEl({ className: styles['chat-user-item'], id: this.user.userId });
    if (this.hasEvent) {
      this.element.addEventListener('mouseover', () => {
        this._hoverOnUser(this.user.nickname, true);
      });
      this.element.addEventListener('mouseleave', () => {
        this._hoverOnUser(this.user.nickname, false);
      });
      this.element.addEventListener('click', () => {
        const userBlockModal = new UserBlockModal({ user: this.user, isBlock: false });
        userBlockModal.render();
      });
    }

    const image = createDivEl({ className: styles['user-image'], background: protectFromXSS(this.user.profileUrl) });
    this.element.appendChild(image);

    this.nickname = createDivEl({
      className: SendBirdAction.getInstance().isCurrentUser(this.user)
        ? [styles['user-nickname'], styles['is-user']]
        : styles['user-nickname'],
      content: protectFromXSS(this.user.nickname)
    });
    this.element.appendChild(this.nickname);
  }

  _hoverOnUser(nickname, hover) {
    this.nickname.innerHTML = hover ? 'UNBLOCK' : protectFromXSS(nickname);
    this.nickname.style.color = hover ? COLOR_RED : '';
    this.nickname.style.opacity = hover ? '1' : '';
  }
}

export { ChatUserItem };
