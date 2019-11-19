import styles from '../../scss/chat-body.scss';
import { createDivEl, getDataInElement, removeClass, findMessageIndex, mergeFailedWithSuccessful } from '../utils';
import { Message } from './Message';
import { SendBirdAction } from '../SendBirdAction';
import { MESSAGE_REQ_ID } from '../const';
import SendBirdSyncManager from 'sendbird-syncmanager';
import { Spinner } from './Spinner';

class ChatBody {
  constructor(channel) {
    this.channel = channel;
    this.readReceiptManageList = [];
    this.scrollHeight = 0;
    this.collection = null;
    this.limit = 50;
    this.element = createDivEl({ className: styles['chat-body'] });
    this._initElement();
    this.spinnerStarted = false;
  }

  _initElement() {
    if (this.collection) {
      this.collection.remove();
    }
    this.collection = new SendBirdSyncManager.MessageCollection(this.channel);
    this.collection.limit = this.limit;

    const collectionHandler = new SendBirdSyncManager.MessageCollection.CollectionHandler();
    collectionHandler.onSucceededMessageEvent = this._messageEventHandler.bind(this);
    collectionHandler.onFailedMessageEvent = this._messageEventHandler.bind(this);
    collectionHandler.onPendingMessageEvent = this._messageEventHandler.bind(this);
    collectionHandler.onNewMessage = (event) => { this._onNewMessageEventHandler(event, this.collection) };
    this.collection.setCollectionHandler(collectionHandler);

    this.element.addEventListener('scroll', () => {
      if (this.element.scrollTop === 0) {
        this.updateCurrentScrollHeight();
        this.collection.fetchSucceededMessages('prev', () => {
          this.element.scrollTop = this.element.scrollHeight - this.scrollHeight;
        });
      }

      if (this.element.scrollHeight - this.element.scrollTop - this.element.clientHeight === 0) {
        const newMessagePop = document.getElementById('new-message-pop');
        if (newMessagePop) newMessagePop.remove();
      }
    });
  }

  _onNewMessageEventHandler(event, col) {
    const messages = col.messages;
    let isOnNewMessage = !(messages.every(message => (message.messageId !== event.messageId)));

    if (isOnNewMessage) {
      if (this.element.scrollTop < this.element.scrollHeight - this.element.offsetHeight && !(document.getElementById('new-message-pop'))) {
        const newMessagePop = document.createElement('div');
        newMessagePop.setAttribute('id', 'new-message-pop');
        newMessagePop.setAttribute('class', 'new-message-pop');

        const popText = document.createElement('div');
        popText.setAttribute('class', 'new-message-pop-text');
        popText.innerText = 'check new message';
        newMessagePop.appendChild(popText);
        popText.addEventListener('click', () => {
          newMessagePop.remove();
          this.scrollToBottom();
        });

        this.element.appendChild(newMessagePop);
      }
    } else {
      console.log('There is no onNewMessage in collection');
    }
  }

  _messageEventHandler(messages, action, reason) {
    const keepScrollToBottom = this.element.scrollTop >= this.element.scrollHeight - this.element.offsetHeight;
    messages.sort((a, b) => a.createdAt - b.createdAt);
    switch (action) {
      case 'insert': {
        this._mergeMessagesOnInsert(messages);
        break;
      }
      case 'update': {
        if (reason === SendBirdSyncManager.MessageCollection.FailedMessageEventActionReason.UPDATE_RESEND_FAILED) {
          this._updateMessages(messages, true);
        } else {
          this._updateMessages(messages);
        }
        break;
      }
      case 'remove': {
        this._removeMessages(messages);
        break;
      }
      case 'clear': {
        this._clearMessages();
        break;
      }
      default: break;
    }
    if (keepScrollToBottom) {
      this.scrollToBottom();
    }
  }

  _mergeMessagesOnInsert(messages) {
    const wholeCollectionMessages = mergeFailedWithSuccessful(
      this.collection.unsentMessages,
      this.collection.succeededMessages
    );
    for (let i in messages) {
      const message = messages[i];
      const index = findMessageIndex(message, wholeCollectionMessages);
      if (index >= 0) {
        const messageElements = this.element.querySelectorAll('.chat-message');
        const messageItem = new Message({ channel: this.channel, message, col: this.collection });
        this.element.insertBefore(messageItem.element, messageElements[index]);
        if (
          (message.isUserMessage() || message.isFileMessage()) &&
          SendBirdAction.getInstance().isCurrentUser(message.sender)
        ) {
          this.readReceiptManage(message);
        }
      }
    }
  }

  _updateMessages(messages, transformToManual = false) {
    for (let i in messages) {
      const message = messages[i];
      const messageItem = new Message({
        channel: this.channel,
        message,
        isManual: transformToManual,
        col: this.collection
      });
      const currentItem = this._getItem(message.reqId);
      const requestItem = message.reqId ? this._getItem(message.reqId) : null;
      if (currentItem || requestItem) {
        this.element.replaceChild(messageItem.element, requestItem ? requestItem : currentItem);
      }
    }
  }

  _removeMessages(messages) {
    if (
      this.collection.unsentMessages.length > 0 &&
      messages.length > 0 &&
      messages[0].messageId === 0 &&
      !this.spinnerStarted
    ) {
      const el = this._getItem(messages[0].reqId);
      const resendButton = el.firstChild.getElementsByClassName('resend-button');
      if (resendButton && resendButton.length === 0) {
        Spinner.start(this.element);
        this.spinnerStarted = true;
      }
    }
    for (let i in messages) {
      const message = messages[i];
      this.removeMessage(message.reqId);
    }
    if (
      (this.spinnerStarted && this.collection.unsentMessages.length === 0) ||
      SendBirdAction.getInstance().getConnectionState() !== 'OPEN'
    ) {
      this.stopSpinner();
    }
  }

  stopSpinner() {
    Spinner.remove();
    this.spinnerStarted = false;
  }

  _clearMessages() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }

  loadPreviousMessages(callback) {
    this.collection.fetchSucceededMessages('prev', () => {
      this.collection.fetchFailedMessages(() => {
        if (callback) callback();
      });
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
        const messageItem = this._getItem(message.reqId);
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

  _getItem(reqId) {
    const items = this.element.childNodes;
    // We go in reverse order to prevent situations that
    // pending-message remove requests accidentally delete succeeded messages
    for (let i = items.length - 1; i >= 0; i--) {
      const elementId = getDataInElement(items[i], MESSAGE_REQ_ID);
      if (elementId === reqId.toString()) {
        return items[i];
      }
    }
    return null;
  }

  removeMessage(reqId) {
    const removeElement = this._getItem(reqId);
    if (removeElement) {
      this.element.removeChild(removeElement);
    }
  }
}

export { ChatBody };
