import { className } from '../consts.js';
import Element from './elements.js';

const EMPTY_STRING = '';

class Spinner extends Element {
  constructor() {
    super();
    this._create();
  }

  _create() {
    this.self = this.createDiv();
    this._setClass(this.self, [className.SPINNER]);
    var i;
    for (i = 0 ; i < 3 ; i++) {
      this.self.appendChild(this.createDiv());
    }
  }

  insert(target) {
    this._setContent(target, EMPTY_STRING);
    target.appendChild(this.self);
  }

  remove(target) {
    if (target.firstElementChild) {
      target.removeChild(this.self);
    }
  }
}

export { Spinner as default };
