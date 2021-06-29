'use strict';

import Element from './element.js';

const SPINNER_COUNT = 3;

class Spinner extends Element {
  constructor() {
    super();
    this.setClass('sb-spinner');
    for(let i = 0 ; i < SPINNER_COUNT ; i++) {
      this.appendElement(new Element());
    }
  }

  attachTo($target) {
    $target.val("");
    $target.appendElement(this);
  }

  remove($target) {
    if ($target.first()) {
      $target.removeElement(this);
    }
  }
}

export { Spinner as default };
