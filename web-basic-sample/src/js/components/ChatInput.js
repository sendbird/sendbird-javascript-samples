import styles from '../../scss/chat-input.scss';
import { createDivEl, protectFromXSS } from '../utils';
import { DISPLAY_BLOCK, DISPLAY_NONE, FILE_ID, KEY_ENTER } from '../const';
import { SendBirdAction } from '../SendBirdAction';
import { Chat } from '../Chat';

class ChatInput {
  constructor(channel) {
    this.channel = channel;
    this.input = null;
    this.typing = null;
    this.element = this._createElement(channel);
  }

  _createElement(channel) {
    const root = createDivEl({ className: styles['chat-input'] });

    this.typing = createDivEl({ className: styles['typing-field'] });
    root.appendChild(this.typing);

    const file = document.createElement('label');
    file.className = styles['input-file'];
    file.for = FILE_ID;
    file.addEventListener('click', () => {
      if (this.channel.isGroupChannel()) {
        SendBirdAction.getInstance().markAsRead(this.channel);
      }
    });

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = FILE_ID;
    fileInput.style.display = DISPLAY_NONE;
    fileInput.addEventListener('change', () => {
      const sendFile = fileInput.files[0];
      if (sendFile) {
        const tempMessage = SendBirdAction.getInstance().sendFileMessage({
          channel: this.channel,
          file: sendFile,
          handler: (message, error) => {
            error
              ? Chat.getInstance().main.removeMessage(tempMessage.reqId, true)
              : Chat.getInstance().main.renderMessages([message]);
          }
        });
        Chat.getInstance().main.renderMessages([tempMessage]);
      }
    });

    file.appendChild(fileInput);
    root.appendChild(file);

    const inputText = createDivEl({ className: styles['input-text'] });

    this.input = document.createElement('textarea');
    this.input.className = styles['input-text-area'];
    this.input.placeholder = 'Write a chat...';
    this.input.addEventListener('click', () => {
      if (this.channel.isGroupChannel()) {
        SendBirdAction.getInstance().markAsRead(this.channel);
      }
    });
    this.input.addEventListener('keypress', e => {
      if (e.keyCode === KEY_ENTER) {
        if (!e.shiftKey) {
          e.preventDefault();
          const message = this.input.value;
          this.input.value = '';
          if (message) {
            const tempMessage = SendBirdAction.getInstance().sendUserMessage({
              channel: this.channel,
              message,
              handler: (message, error) => {
                error
                  ? Chat.getInstance().main.removeMessage(tempMessage.reqId, true)
                  : Chat.getInstance().main.renderMessages([message]);
              }
            });
            Chat.getInstance().main.renderMessages([tempMessage]);
            if (channel.isGroupChannel()) {
              channel.endTyping();
            }
          }
        } else {
          if (channel.isGroupChannel()) {
            channel.startTyping();
          }
        }
      } else {
        if (channel.isGroupChannel()) {
          channel.startTyping();
        }
      }
    });
    this.input.addEventListener('focusin', () => {
      this.channel._autoMarkAsRead = true;
      inputText.style.border = '1px solid #2C2D30';
    });
    this.input.addEventListener('focusout', () => {
      this.channel._autoMarkAsRead = false;
      inputText.style.border = '';
    });

    inputText.appendChild(this.input);
    root.appendChild(inputText);
    return root;
  }

  updateTyping(memberList) {
    let nicknames = '';
    if (memberList.length === 1) {
      nicknames = `${protectFromXSS(memberList[0].nickname)} is`;
    } else if (memberList.length === 2) {
      nicknames = `${memberList
        .map(member => {
          return protectFromXSS(member.nickname);
        })
        .join(', ')} are`;
    } else if (memberList.length !== 0) {
      nicknames = 'Several are';
    }
    this.typing.style.display = nicknames ? DISPLAY_BLOCK : DISPLAY_NONE;
    this.typing.innerHTML = `${nicknames} typing...`;
  }
}

export { ChatInput };
