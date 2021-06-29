import styles from '../../scss/message.scss';
import { createDivEl, isImage, protectFromXSS, setDataInElement, timestampToTime } from '../utils';
import { SendBirdAction } from '../SendBirdAction';
import { COLOR_RED, MESSAGE_REQ_ID } from '../const';
import { MessageDeleteModal } from './MessageDeleteModal';
import { UserBlockModal } from './UserBlockModal';
import { Chat } from '../Chat';

class Message {
  constructor({ channel, message, isManual = false, col = null }) {
    this.channel = channel;
    this.message = message;
    this.isFailed = message.messageId === 0 && message.requestState === 'failed';
    this.isManual = this.isFailed ? isManual : false;
    this.element = this._createElement();
    if (col) {
      this.col = col;
    }
  }

  _createElement() {
    if (this.message.isUserMessage()) {
      return this._createUserElement();
    } else if (this.message.isFileMessage()) {
      return this._createFileElement();
    } else if (this.message.isAdminMessage()) {
      return this._createAdminElement();
    } else {
      // console.error('Message is invalid data.');
      return null;
    }
  }

  _hoverOnNickname(nickname, hover) {
    if (!SendBirdAction.getInstance().isCurrentUser(this.message.sender)) {
      nickname.innerHTML = hover ? 'BLOCK   ' : `${protectFromXSS(this.message.sender.nickname)} : `;
      nickname.style.color = hover ? COLOR_RED : '';
      nickname.style.opacity = hover ? '1' : '';
    }
  }

  _hoverOnTime(time, hover) {
    if (SendBirdAction.getInstance().isCurrentUser(this.message.sender)) {
      time.innerHTML = hover ? 'DELETE' : timestampToTime(this.message.createdAt);
      time.style.color = hover ? COLOR_RED : '';
      time.style.opacity = hover ? '1' : '';
      time.style.fontWeight = hover ? '600' : '';
    }
  }

  _createUserElement() {
    const sendbirdAction = SendBirdAction.getInstance();
    const isCurrentUser = sendbirdAction.isCurrentUser(this.message.sender);
    let root;
    if (this.isFailed && !this.isManual) {
      root = createDivEl({
        className: [styles['chat-message'], styles['is-failed']],
        id: this.message.reqId
      });
    } else {
      root = createDivEl({
        className: styles['chat-message'],
        id: this.message.reqId
      });
    }
    setDataInElement(root, MESSAGE_REQ_ID, this.message.reqId);

    const messageContent = createDivEl({ className: styles['message-content'] });
    const nickname = createDivEl({
      className: isCurrentUser ? [styles['message-nickname'], styles['is-user']] : styles['message-nickname'],
      content: `${protectFromXSS(this.message.sender.nickname)} : `
    });
    nickname.addEventListener('mouseover', () => {
      this._hoverOnNickname(nickname, true);
    });
    nickname.addEventListener('mouseleave', () => {
      this._hoverOnNickname(nickname, false);
    });
    nickname.addEventListener('click', () => {
      if (!isCurrentUser) {
        const userBlockModal = new UserBlockModal({ user: this.message.sender, isBlock: true });
        userBlockModal.render();
      }
    });
    messageContent.appendChild(nickname);

    const msg = createDivEl({ className: styles['message-content'], content: protectFromXSS(this.message.message) });
    messageContent.appendChild(msg);

    if (this.isFailed && this.isManual) {
      const resendButton = createDivEl({
        className: styles['resend-button'],
        content: 'RESEND'
      });
      resendButton.addEventListener('click', () => {
        this._resendUserMessage();
      });
      messageContent.appendChild(resendButton);
    }
    if (this.isFailed) {
      const deleteButton = createDivEl({
        className: styles['delete-button'],
        content: 'DELETE'
      });
      deleteButton.addEventListener('click', () => {
        if (isCurrentUser) {
          const messageDeleteModal = new MessageDeleteModal({
            channel: this.channel,
            message: this.message,
            col: this.col
          });
          messageDeleteModal.render();
        }
      });
      messageContent.appendChild(deleteButton);
    }
    if (!this.isFailed) {
      const time = createDivEl({
        className: isCurrentUser ? [styles.time, styles['is-user']] : styles.time,
        content: timestampToTime(this.message.createdAt)
      });
      time.addEventListener('mouseover', () => {
        this._hoverOnTime(time, true);
      });
      time.addEventListener('mouseleave', () => {
        this._hoverOnTime(time, false);
      });
      time.addEventListener('click', () => {
        if (isCurrentUser) {
          const messageDeleteModal = new MessageDeleteModal({
            channel: this.channel,
            message: this.message
          });
          messageDeleteModal.render();
        }
      });
      messageContent.appendChild(time);

      const count = sendbirdAction.getReadReceipt(this.channel, this.message);
      const read = createDivEl({
        className: count ? [styles.read, styles.active] : styles.read,
        content: count
      });
      messageContent.appendChild(read);
    }

    root.appendChild(messageContent);
    return root;
  }

  _resendUserMessage() {
    this.channel.resendUserMessage(this.message, (message, err) => {
      this.col.handleSendMessageResponse(err, message);
    });
  }

  _createFileElement() {
    const sendbirdAction = SendBirdAction.getInstance();
    const root = createDivEl({ className: styles['chat-message'], id: this.message.messageId });
    setDataInElement(root, MESSAGE_REQ_ID, this.message.reqId);

    const messageContent = createDivEl({ className: styles['message-content'] });
    const nickname = createDivEl({
      className: sendbirdAction.isCurrentUser(this.message.sender)
        ? [styles['message-nickname'], styles['is-user']]
        : styles['message-nickname'],
      content: `${protectFromXSS(this.message.sender.nickname)} : `
    });
    messageContent.appendChild(nickname);

    const msg = createDivEl({
      className: [styles['message-content'], styles['is-file']],
      content: protectFromXSS(this.message.name)
    });
    msg.addEventListener('click', () => {
      window.open(this.message.url);
    });
    messageContent.appendChild(msg);

    const time = createDivEl({ className: styles.time, content: timestampToTime(this.message.createdAt) });
    time.addEventListener('mouseover', () => {
      this._hoverOnTime(time, true);
    });
    time.addEventListener('mouseleave', () => {
      this._hoverOnTime(time, false);
    });
    time.addEventListener('click', () => {
      const messageDeleteModal = new MessageDeleteModal({
        channel: this.channel,
        message: this.message
      });
      messageDeleteModal.render();
    });
    messageContent.appendChild(time);

    if (this.channel.isGroupChannel()) {
      const count = sendbirdAction.getReadReceipt(this.channel, this.message);
      const read = createDivEl({
        className: count ? [styles.read, styles.active] : styles.read,
        content: count
      });
      messageContent.appendChild(read);
    }

    root.appendChild(messageContent);

    if (this.message.isFileMessage() && this.message.messageId) {
      const fileContent = createDivEl({ className: styles['file-content'] });
      fileContent.addEventListener('click', () => {
        window.open(this.message.url);
      });
      if (this.message.thumbnails.length > 0 || isImage(this.message.type)) {
        const fileRender = document.createElement('img');
        fileRender.className = styles['file-render'];

        if (isImage(this.message.type)) {
          fileRender.src = protectFromXSS(this.message.url);
        } else if (this.message.thumbnails.length > 0) {
          fileRender.src = protectFromXSS(this.message.thumbnails[0].url);
        }

        fileRender.onload = () => {
          Chat.getInstance().main.repositionScroll(fileRender.offsetHeight);
        };
        fileContent.appendChild(fileRender);
      }
      root.appendChild(fileContent);
    }

    return root;
  }

  _createAdminElement() {
    const root = createDivEl({ className: styles['chat-message'], id: this.message.messageId });
    const msg = createDivEl({ className: styles['message-admin'], content: protectFromXSS(this.message.message) });
    root.appendChild(msg);
    return root;
  }

  static getReadReceiptElementClassName() {
    return styles.active;
  }
}

export { Message };
