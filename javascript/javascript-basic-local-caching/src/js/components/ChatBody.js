import styles from '../../scss/chat-body.scss';
import { createDivEl, getDataInElement, removeClass, findMessageIndex, mergeFailedWithSuccessful } from '../utils';
import { Message } from './Message';
import { SendBirdAction } from '../SendBirdAction';
import { MESSAGE_REQ_ID } from '../const';
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
    this.messagesView = [];
  }

  _initElement() {
    if (this.collection) {
      this.collection.dispose();
    }
    const action = SendBirdAction.getInstance();
    const sb = action.sb;
    const messageFilter = new sb.MessageFilter();
    this.collection = this.channel
      .createMessageCollection()
      .setFilter(messageFilter)
      .setStartingPoint(new Date().getTime())
      .setLimit(this.limit)
      .build();

    this.collection.setMessageCollectionHandler({
      onMessagesAdded: (context, channel, messages) => {
        this._mergeMessagesOnInsert(messages);
      },
      onMessagesUpdated: (context, channel, messages) => {
        this._updateMessages(messages);
      },
      onMessagesDeleted: (context, channel, messages) => {
        this._removeMessages(messages);
      },
      onChannelUpdated: (context, channel) => {},
      onChannelDeleted: (context, channel) => {},
      onHugeGapDetected: () => {}
    });

    this.element.addEventListener('scroll', () => {
      if (this.element.scrollTop === 0) {
        this.updateCurrentScrollHeight();
        this.collection.loadPrevious().then(messages => {
          this.element.scrollTop = this.element.scrollHeight - this.scrollHeight;
        });
      }

      if (this.element.scrollHeight - this.element.scrollTop - this.element.clientHeight === 0) {
        const newMessagePop = document.getElementById('new-message-pop');
        if (newMessagePop) newMessagePop.remove();
      }
    });
  }

  _mergeMessagesOnInsert(messages) {
    const { pendingMessages, succeededMessages, failedMessages } = this.collection;
    const wholeCollectionMessages = [...pendingMessages, ...succeededMessages, ...failedMessages];
    wholeCollectionMessages.sort((message1, message2) => {
      if (message1.messageId !== 0 && message2.messageId !== 0) {
        return message1.messageId - message2.messageId;
      } else if (message1.reqId && message2.reqId) {
        return parseInt(message1.reqId) - parseInt(message2.reqId);
      }
      return message1.createdAt - message2.createdAt;
    });
    for (let message of messages) {
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
      this.collection.pendingMessages.length > 0 &&
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
      (this.spinnerStarted && this.collection.pendingMessages.length === 0) ||
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
    this.collection.loadPrevious().then(messages => {
      this._mergeMessagesOnInsert(messages);
      callback();
    });
  }

  loadInitialMessages(callback) {
    const action = SendBirdAction.getInstance();
    const sb = action.sb;
    this.collection
      .initialize(sb.MessageCollection.MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API, new Date().getTime())
      .onCacheResult((error, messages) => {
        this._mergeMessagesOnInsert(messages);
      })
      .onApiResult((error, messages) => {
        this.element.innerHTML = '';
        this._mergeMessagesOnInsert(messages);
        callback();
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
