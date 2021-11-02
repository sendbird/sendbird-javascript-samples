'use strict';
import Element from './element.js';

class ChatBoard extends Element {
  constructor(parent) {
    super();
    this.setClass('chat-board');
    parent.appendElement(this);
  }
}

export { ChatBoard as default };
