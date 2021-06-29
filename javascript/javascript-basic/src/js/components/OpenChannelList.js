import { errorAlert } from '../utils';
import { Spinner } from './Spinner';
import { SendBirdAction } from '../SendBirdAction';
import { OpenChannelItem } from './OpenChannelItem';
import { List } from './List';
import { body as targetEl } from '../const';
import { ChatLeftMenu } from '../ChatLeftMenu';

let instance = null;

class OpenChannelList extends List {
  constructor() {
    super('Open Channel List', true);
    if (instance) {
      return instance;
    }

    this.scrollEventHandler = this._getOpenChannelList;
    this.searchKeyword = '';
    instance = this;
  }

  _getOpenChannelList(isInit = false, urlKeyword = '') {
    Spinner.start(this.element);

    if (urlKeyword !== this.searchKeyword) {
      this.searchKeyword = urlKeyword;
      isInit = true;
    }

    const listContent = this.getContentElement();
    if (isInit) {
      listContent.innerHTML = '';
    }

    SendBirdAction.getInstance()
      .getOpenChannelList(isInit, urlKeyword)
      .then(openChannelList => {
        openChannelList.forEach(channel => {
          const handler = () => {
            const existItem = ChatLeftMenu.getInstance().getChannelItem(channel.url);
            if (existItem) {
              existItem.click();
              this.close();
            } else {
              SendBirdAction.getInstance()
                .enter(item.channelUrl)
                .then(() => {
                  this.close();
                })
                .catch(error => {
                  errorAlert(error.message);
                });
            }
          };
          const item = new OpenChannelItem({ channel, handler });
          listContent.appendChild(item.element);
        });
        Spinner.remove();
      })
      .catch(error => {
        errorAlert(error.message);
      });
  }

  render() {
    if (!targetEl.querySelector(`.${this.getRootClassName()}`)) {
      targetEl.appendChild(this.element);
      this._getOpenChannelList(true);
    }
  }

  static getInstance() {
    return new OpenChannelList();
  }
}

export { OpenChannelList };
