import styles from '../../scss/list.scss';
import { createDivEl } from '../utils';
import { KEY_ENTER, OPEN_CHANNEL_SEARCH_URL } from '../const';
import { OpenChannelList } from './OpenChannelList';

class OpenChannelSearchBox {
  constructor() {
    this.element = this._create();
  }

  _create() {
    const searchChannelBox = createDivEl({ className: styles['list-search'] });
    const searchInputBox = document.createElement('input');
    searchInputBox.type = 'text';
    searchInputBox.id = OPEN_CHANNEL_SEARCH_URL;
    searchInputBox.className = styles['search-input'];
    searchInputBox.placeholder = 'Search by ChannelUrl...';
    searchInputBox.addEventListener('keydown', e => {
      if (e.keyCode === KEY_ENTER) {
        OpenChannelList.getInstance().scrollEventHandler(true, searchInputBox.value);
      }
    });

    searchChannelBox.appendChild(searchInputBox);
    return searchChannelBox;
  }

  static clearText() {
    const textBox = document.querySelector(`#${OPEN_CHANNEL_SEARCH_URL}`);
    if (textBox) {
      textBox.value = '';
    }
  }
}

export { OpenChannelSearchBox };
