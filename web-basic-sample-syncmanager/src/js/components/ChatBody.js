import styles from '../../scss/chat-body.scss';
import { createDivEl, getDataInElement, removeClass, findMessageIndex } from '../utils';
import { Message } from './Message';
import { SendBirdAction } from '../SendBirdAction';
import { MESSAGE_REQ_ID } from '../const';

import SendBirdSyncManager from 'sendbird-syncmanager';

class ChatBody {
  constructor(channel) {
    this.channel = channel;
    this.readReceiptManageList = [];
    this.scrollHeight = 0;
    this.collection = null;
    this.limit = 50;
    this.element = createDivEl({ className: styles['chat-body'] });
    this._initElement();
  }
  
  _initElement() {
    if(this.collection) {
      this.collection.remove();
    }
    this.collection = new SendBirdSyncManager.MessageCollection(this.channel, { limit: this.limit });
    this.collection.limit = this.limit;

    const collectionHandler = new SendBirdSyncManager.MessageCollection.CollectionHandler();
    collectionHandler.onMessageEvent = (action, message) => {
      const messageElements = this.element.querySelectorAll('.chat-message');
      const keepScrollToBottom = this.element.scrollTop >= this.element.scrollHeight - this.element.offsetHeight;
      switch(action) {
        case 'insert': {
          const index = findMessageIndex(message, this.collection.messages);
          if(index >= 0) {
            const messageItem = new Message({ channel: this.channel, message });
            if(index === this.collection.messages.length) {
              this.element.appendChild(messageItem.element);
            } else {
              this.element.insertBefore(messageItem.element, messageElements[index]);
            }
            if ((message.isUserMessage() || message.isFileMessage()) && SendBirdAction.getInstance().isCurrentUser(message.sender)) {
              this.readReceiptManage(message);
            }
          }
          break;
        }
        case 'update': {
          const messageItem = new Message({ channel: this.channel, message });
          const currentItem = this._getItem(message.messageId, false);
          const requestItem = message.reqId ? this._getItem(message.reqId, true) : null;
          if(currentItem || requestItem) {
            this.element.replaceChild(messageItem.element, requestItem ? requestItem : currentItem);
          }
          break;
        }
        case 'remove': {
          if(message.messageId) {
            this.removeMessage(message.messageId);
          } else {
            this.removeMessage(message.reqId, true);
          }
          break;
        }
        case 'clear': {
          while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
          }
          break;
        }
      }
      if(keepScrollToBottom) {
        this.scrollToBottom();
      }
    };
    this.collection.setCollectionHandler(collectionHandler);

    this.element.addEventListener('scroll', () => {
      if (this.element.scrollTop === 0) {
        this.updateCurrentScrollHeight();
        this.collection.fetch('prev', () => {
          this.element.scrollTop = this.element.scrollHeight - this.scrollHeight;
        });
      }
    });
  }

  loadPreviousMessages(callback) {
    this.collection.fetch('prev', () => {
      if(callback) callback();
    });
  }

  scrollToBottom() {
    this.element.scrollTop = this.element.scrollHeight - this.element.offsetHeight;
  }

  updateCurrentScrollHeight() {
    this.scrollHeight = this.element.scrollHeight;
  }

  repositionScroll(imageOffsetHeight) {
    this.element.scrollTop += imageOffsetHeight;
  }

  updateReadReceipt() {
    this.readReceiptManageList.forEach(message => {
      if (message.messageId.toString() !== '0') {
        const className = Message.getReadReceiptElementClassName();
        const messageItem = this._getItem(message.messageId, false);
        if (messageItem) {
          let readItem = null;
          try {
            readItem = messageItem.getElementsByClassName(className)[0];
          } catch (e) {
            readItem = null;
          }
          const latestCount = SendBirdAction.getInstance().getReadReceipt(this.channel, message);
          if (readItem && latestCount.toString() !== readItem.textContent.toString()) {
            readItem.innerHTML = latestCount;
            if (latestCount.toString() === '0') {
              removeClass(readItem, className);
            }
          }
        }
      }
    });
  }

  readReceiptManage(message) {
    for (let i = 0; i < this.readReceiptManageList.length; i++) {
      if (message.reqId) {
        if (this.readReceiptManageList[i].reqId === message.reqId) {
          this.readReceiptManageList.splice(i, 1);
          break;
        }
      } else {
        if (this.readReceiptManageList[i].messageId === message.messageId) {
          this.readReceiptManageList.splice(i, 1);
          break;
        }
      }
    }
    this.readReceiptManageList.push(message);
    this.updateReadReceipt();
  }

  _getItem(messageId, isRequestId = false) {
    const items = this.element.childNodes;
    for (let i = 0; i < items.length; i++) {
      const elementId = isRequestId ? getDataInElement(items[i], MESSAGE_REQ_ID) : items[i].id;
      if (elementId === messageId.toString()) {
        return items[i];
      }
    }
    return null;
  }

  removeMessage(messageId, isRequestId = false) {
    const removeElement = this._getItem(messageId, isRequestId);
    if (removeElement) {
      this.element.removeChild(removeElement);
    }
  }
}

export { ChatBody };
