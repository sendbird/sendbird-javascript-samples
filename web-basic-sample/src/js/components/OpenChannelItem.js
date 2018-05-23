import styles from '../../scss/open-channel-item.scss';
import { createDivEl, timestampToDateString } from '../utils';

class OpenChannelItem {
  constructor({ channel, handler }) {
    this.channel = channel;
    this.element = this._createElement(handler);
  }

  get title() {
    return `# ${this.channel.name}`;
  }

  get channelUrl() {
    return this.channel.url;
  }

  get createTimeString() {
    return `Created on ${timestampToDateString(this.channel.createdAt)}`;
  }

  _createElement(handler) {
    const item = createDivEl({ className: styles['channel-item'], id: this.channelUrl });
    const title = createDivEl({ className: styles['item-title'], content: this.title });
    item.appendChild(title);
    const desc = createDivEl({ className: styles['item-desc'], content: this.createTimeString });
    item.appendChild(desc);
    item.addEventListener('click', () => {
      if (handler) handler();
    });
    return item;
  }
}

export { OpenChannelItem };
