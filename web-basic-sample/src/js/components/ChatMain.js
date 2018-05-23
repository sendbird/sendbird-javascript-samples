import styles from '../../scss/chat-main.scss';
import { ChatBody } from './ChatBody';
import { ChatInput } from './ChatInput';
import { Chat } from '../Chat';
import { createDivEl } from '../utils';
import { ChatMenu } from './ChatMenu';

class ChatMain {
  constructor(channel) {
    this.channel = channel;
    this.body = null;
    this.input = null;
    this.menu = null;
    this._create();
  }

  _create() {
    const root = createDivEl({ className: styles['chat-main-root'] });

    const main = createDivEl({ className: styles['chat-main'] });
    root.appendChild(main);

    this.body = new ChatBody(this.channel);
    main.appendChild(this.body.element);

    this.input = new ChatInput(this.channel);
    main.appendChild(this.input.element);

    this.menu = new ChatMenu(this.channel);
    root.appendChild(this.menu.element);

    Chat.getInstance().element.appendChild(root);
  }

  renderMessages(messageList, goToBottom = true, isPastMessage = false) {
    this.body.renderMessages(messageList, goToBottom, isPastMessage);
  }

  removeMessage(messageId, isRequestId = false) {
    this.body.removeMessage(messageId, isRequestId);
  }

  updateReadReceipt() {
    this.body.updateReadReceipt();
  }

  updateTyping(memberList) {
    this.input.updateTyping(memberList);
  }

  repositionScroll(height) {
    this.body.repositionScroll(height);
  }

  updateBlockedList(user, isBlock) {
    this.menu.updateBlockedList(user, isBlock);
  }

  updateMenu(channel) {
    this.menu.updateMenu(channel);
  }
}

export { ChatMain };
