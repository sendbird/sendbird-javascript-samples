import styles from '../../scss/open-create-modal.scss';
import { errorAlert } from '../utils';
import { SendBirdAction } from '../SendBirdAction';
import { Spinner } from './Spinner';
import { Modal } from './Modal';

class OpenChannelCreateModal extends Modal {
  constructor({ title, description, submitText }) {
    super({ title, description, submitText });
    this._createElement();
    this._createHandler();
  }

  _createElement() {
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Please enter name of Open Channel.';
    this.input.className = styles['modal-input'];
    this.input.maxLength = 20;
    this.contentElement.appendChild(this.input);
  }

  _createHandler() {
    this.cancelHandler = () => {
      this.input.value = '';
    };

    this.submitHandler = () => {
      SendBirdAction.getInstance()
        .createOpenChannel(this.input.value)
        .then(channel => {
          SendBirdAction.getInstance()
            .enter(channel.url)
            .then(() => {
              this.input.value = '';
              Spinner.remove();
              this.close();
            })
            .catch(error => {
              errorAlert(error.message);
            });
        })
        .catch(error => {
          errorAlert(error.message);
        });
    };
  }
}

export { OpenChannelCreateModal };
