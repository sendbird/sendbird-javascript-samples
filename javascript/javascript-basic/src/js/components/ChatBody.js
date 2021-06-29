import styles from '../../scss/chat-body.scss';
import { appendToFirst, createDivEl, errorAlert, getDataInElement, isScrollBottom, removeClass } from '../utils';
import { Message } from './Message';
import { SendBirdAction } from '../SendBirdAction';
import { Spinner } from './Spinner';
import { MESSAGE_REQ_ID } from '../const';

class ChatBody {
  constructor(channel) {
    this.channel = channel;
    this.readReceiptManageList = [];
    this.scrollHeight = 0;
    this.element = this._createElement();
  }

  _createElement() {
    const root = createDivEl({ className: styles['chat-body'] });
    root.addEventListener('scroll', () => {
      if (root.scrollTop === 0) {
        Spinner.start(root);
        this.updateCurrentScrollHeight();
        SendBirdAction.getInstance()
          .getMessageList(this.channel)
          .then(messageList => {
            messageList.reverse();
            this.renderMessages(messageList, false, true);
            Spinner.remove();
          })
          .catch(error => {
            errorAlert(error.message);
          });
      }
    });
    return root;
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

  renderMessages(messageList, goToBottom = true, isPastMessage = false) {
    messageList.forEach(message => {
      const messageItem = new Message({ channel: this.channel, message });
      const requestId = getDataInElement(messageItem.element, MESSAGE_REQ_ID)
        ? getDataInElement(messageItem.element, MESSAGE_REQ_ID)
        : '-1';
      const requestItem = this._getItem(requestId, true);
      const existItem = this._getItem(messageItem.element.id, false);
      if (requestItem || existItem) {
        this.element.replaceChild(messageItem.element, requestItem ? requestItem : existItem);
      } else {
        if (isPastMessage) {
          appendToFirst(this.element, messageItem.element);
          this.element.scrollTop = this.element.scrollHeight - this.scrollHeight;
        } else {
          const isBottom = isScrollBottom(this.element);
          this.element.appendChild(messageItem.element);
          if (isBottom) {
            this.scrollToBottom();
          }
        }
      }
      if (
        (message.isUserMessage() || message.isFileMessage()) &&
        SendBirdAction.getInstance().isCurrentUser(message.sender) &&
        this.channel.isGroupChannel()
      ) {
        this.readReceiptManage(message);
      }
    });
    if (goToBottom) this.scrollToBottom();
  }

  removeMessage(messageId, isRequestId = false) {
    const removeElement = this._getItem(messageId, isRequestId);
    if (removeElement) {
      this.element.removeChild(removeElement);
    }
  }
}

export { ChatBody };
