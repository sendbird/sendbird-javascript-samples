
import styles from '../../scss/toast.scss';
import { createDivEl } from '../utils';

let instance = null;

class Toast {
  constructor(message) {
    if (instance) {
      const messageEl = instance.element.getElementsByClassName('sb-toast-message')[0];
      if(messageEl) {
        if(!message) {
          message = messageEl.innerHTML;
        }
        messageEl.innerHTML = message;
      }
      return instance;
    }
    this.element = this._createToast(message);
    instance = this;
  }

  _createToast(text) {
    const item = createDivEl({ className: styles['sb-toast'] });
    const message = createDivEl({ className: styles['sb-toast-message'] });
    message.innerHTML = text;
    item.appendChild(message);
    return item;
  }

  static start(target, message) {
    const toast = new Toast(message);
    const toastEl = toast.element;
    if (!target.contains(toastEl)) {
      target.appendChild(toastEl);
    }
  }

  static remove() {
    const toastEl = instance ? instance.element : null;
    if (toastEl) {
      const targetEl = toastEl.parentElement;
      if(targetEl && targetEl.contains(toastEl)) {
        toastEl.parentElement.removeChild(toastEl);
      }
    }
  }
}

export { Toast };
