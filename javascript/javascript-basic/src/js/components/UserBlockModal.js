import styles from '../../scss/user-block-modal.scss';
import { createDivEl, errorAlert, protectFromXSS } from '../utils';
import { SendBirdAction } from '../SendBirdAction';
import { Spinner } from './Spinner';
import { Modal } from './Modal';
import { Chat } from '../Chat';

const blockTitle = 'Block User';
const blockDescription = 'Are you Sure? Do you want to block this user?';
const blockSubmitText = 'BLOCK';

const unblockTitle = 'Unblock User';
const unblockDescription = 'Are you Sure? Do you want to unblock this user?';
const unblockSubmitText = 'UNBLOCK';

class UserBlockModal extends Modal {
  constructor({ user, isBlock = true }) {
    isBlock
      ? super({ title: blockTitle, description: blockDescription, submitText: blockSubmitText })
      : super({ title: unblockTitle, description: unblockDescription, submitText: unblockSubmitText });
    this.isBlock = isBlock;
    this.user = user;
    this._createElement();
    this._createHandler();
  }

  _createElement() {
    const content = createDivEl({ className: styles['modal-user'] });

    const image = createDivEl({ className: styles['user-profile'], background: protectFromXSS(this.user.profileUrl) });
    content.appendChild(image);

    const nickname = createDivEl({ className: styles['user-nickname'], content: protectFromXSS(this.user.nickname) });
    content.appendChild(nickname);

    this.contentElement.appendChild(content);
  }

  _createHandler() {
    this.submitHandler = () => {
      SendBirdAction.getInstance()
        .blockUser(this.user, this.isBlock)
        .then(() => {
          Chat.getInstance().main.updateBlockedList(this.user, this.isBlock);
          Spinner.remove();
          this.close();
        })
        .catch(error => {
          errorAlert(error.message);
        });
    };
  }
}

export { UserBlockModal };
