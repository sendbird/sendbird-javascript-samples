import styles from '../../scss/user-item.scss';
import { createDivEl, protectFromXSS, timestampFromNow, toggleClass } from '../utils';

class UserItem {
  constructor({ user, handler }) {
    this.user = user;
    this.element = this._createElement(handler);
  }

  get userId() {
    return this.user.userId;
  }

  get nickname() {
    return protectFromXSS(this.user.nickname);
  }

  get profileUrl() {
    return protectFromXSS(this.user.profileUrl);
  }

  get lastSeenTimeString() {
    return this.user.lastSeenAt ? timestampFromNow(this.user.lastSeenAt) : '';
  }

  get isOnline() {
    return this.user.connectionStatus === 'online';
  }

  _createElement(handler) {
    const item = createDivEl({ className: styles['user-item'], id: this.userId });

    const userInfo = createDivEl({ className: styles['user-info'] });
    item.appendChild(userInfo);
    const profile = createDivEl({ className: styles['user-profile'], background: this.profileUrl });
    userInfo.appendChild(profile);
    const nickname = createDivEl({ className: styles['user-nickname'], content: this.nickname });
    userInfo.appendChild(nickname);
    const isOnline = createDivEl({
      className: this.isOnline ? [styles['user-online'], styles.active] : styles['user-online']
    });
    userInfo.appendChild(isOnline);

    const userState = createDivEl({ className: styles['user-state'] });
    item.appendChild(userState);
    const lastSeenTime = createDivEl({ className: styles['user-time'], content: this.lastSeenTimeString });
    userState.appendChild(lastSeenTime);
    const selectIcon = createDivEl({ className: styles['user-select'] });
    userState.appendChild(selectIcon);
    item.addEventListener('click', () => {
      toggleClass(item.querySelector(`.${UserItem.selectIconClassName}`), styles.active);
      if (handler) handler();
    });

    return item;
  }

  static get selectIconClassName() {
    return styles['user-select'];
  }
}

export { UserItem };
