import styles from '../../scss/list.scss';
import { createDivEl, isScrollBottom } from '../utils';
import { OpenChannelSearchBox } from './OpenChannelSearchBox';

let instance = null;

class List {
  constructor(title, createSearchBox = false) {
    if (instance) {
      return instance;
    }
    this.createSearchBox = createSearchBox;
    this.element = this._create(title);
    this.scrollEventHandler = null;
    this.closeEventHandler = null;
    this.searchKeyword = '';
  }

  _create(title) {
    const root = createDivEl({ className: styles['list-root'] });

    const listBody = createDivEl({ className: styles['list-body'] });
    root.appendChild(listBody);

    const listTop = createDivEl({ className: styles['list-top'] });
    listBody.appendChild(listTop);

    const listTopTitle = createDivEl({ className: styles['list-title'], content: title });
    listTop.appendChild(listTopTitle);
    const listTopButton = createDivEl({ className: styles['list-button'] });
    listTop.appendChild(listTopButton);
    const listTopButtonExit = createDivEl({ className: styles['button-exit'] });
    listTopButton.appendChild(listTopButtonExit);
    listTopButtonExit.addEventListener('click', () => {
      this.searchKeyword = '';
      OpenChannelSearchBox.clearText();
      const listContent = document.querySelector(`.${styles['list-content']}`);
      if (this.closeEventHandler) {
        this.closeEventHandler();
      }
      listContent.innerHTML = '';
      root.parentElement.removeChild(this.element);
    });
    this.buttonRootElement = listTopButton;

    if (this.createSearchBox) {
      const searchBox = new OpenChannelSearchBox();
      listBody.appendChild(searchBox.element);
    }

    const hr = createDivEl({ className: styles['list-hr'] });
    listBody.appendChild(hr);

    const listContent = createDivEl({ className: styles['list-content'] });
    listBody.appendChild(listContent);
    listContent.addEventListener('scroll', () => {
      if (isScrollBottom(listContent)) {
        if (this.scrollEventHandler) {
          this.scrollEventHandler(false, this.searchKeyword);
        }
      }
    });

    return root;
  }

  close() {
    const btnExit = document.querySelector(`.${styles['button-exit']}`);
    if (btnExit) {
      document.querySelector(`.${styles['button-exit']}`).click();
    }
  }

  getRootElement() {
    return document.querySelector(`.${styles['list-root']}`);
  }

  getRootClassName() {
    return styles['list-root'];
  }

  getContentElement() {
    return document.querySelector(`.${styles['list-content']}`);
  }
}

export { List };
