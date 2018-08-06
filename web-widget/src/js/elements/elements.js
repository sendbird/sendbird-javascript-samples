import '../../scss/widget.scss';
import { removeClass, addClass } from '../utils.js';
import { className, styleValue } from '../consts.js';

class Element {
  constructor() {
    this.tagName = {
      DIV: 'div',
      SPAN: 'span',
      INPUT: 'input',
      UL: 'ul',
      LI: 'li',
      TIME: 'time',
      LABEL: 'label',
      A: 'a',
      IMG: 'img',
      VIDEO: 'video'
    };
    this.eventName = {
      CLICK: 'click',
      KEYDOWN: 'keydown',
      KEYUP: 'keyup',
      CHANGE: 'change',
      SCROLL: 'scroll',
      PASTE: 'paste'
    };
  }

  /*
  Create Elements
   */
  createDiv() {
    return document.createElement(this.tagName.DIV);
  }

  createTime() {
    return document.createElement(this.tagName.TIME);
  }

  createA() {
    return document.createElement(this.tagName.A);
  }

  createImg() {
    return document.createElement(this.tagName.IMG);
  }

  createSpan() {
    return document.createElement(this.tagName.SPAN);
  }

  createLabel() {
    return document.createElement(this.tagName.LABEL);
  }

  createInput() {
    return document.createElement(this.tagName.INPUT);
  }

  createUl() {
    return document.createElement(this.tagName.UL);
  }

  createLi() {
    return document.createElement(this.tagName.LI);
  }

  createVideo() {
    return document.createElement(this.tagName.VIDEO);
  }

  _setClass(...args) {
    args.reduce((target, classes) => {
      return (target.className += classes.join(' '));
    });
  }

  _setContent(target, text) {
    target.innerHTML = text;
  }

  _addContent(target, text) {
    target.innerHTML += text;
  }

  _setBackgroundImage(target, url) {
    target.style.cssText += `background-image: url(${url});`;
  }
  _setBackgroundSize(target, size) {
    target.style.cssText += `background-size: ${size};`;
  }

  _setFontSize(target, size) {
    target.style.cssText += `font-size: ${size ? size + 'px' : null};`;
  }

  _setHeight(target, height) {
    target.style.cssText += `height: ${height}px;`;
  }

  _setWidth(target, width) {
    target.style.cssText += `width: ${width}px;`;
  }

  _setRight(target, right) {
    target.style.cssText += `right: ${right}px;`;
  }

  _setDataset(target, name, data) {
    target.setAttribute('data-' + name, data);
  }

  _setClickEvent(...args) {
    args.reduce((target, action) => {
      target.addEventListener(this.eventName.CLICK, () => {
        action();
      });
    });
  }

  _setPasteEvent(...args) {
    args.reduce((target, action) => {
      target.addEventListener(this.eventName.PASTE, event => {
        action(event);
      });
    });
  }

  _setKeyupEvent(...args) {
    args.reduce((target, action) => {
      target.addEventListener(this.eventName.KEYUP, event => {
        action(event);
      });
    });
  }

  _setKeydownEvent(...args) {
    args.reduce((target, action) => {
      target.addEventListener(this.eventName.KEYDOWN, event => {
        action(event);
      });
    });
  }

  _setChangeEvent(...args) {
    args.reduce((target, action) => {
      target.addEventListener(this.eventName.CHANGE, () => {
        action();
      });
    });
  }

  _setScrollEvent(...args) {
    args.reduce((target, action) => {
      target.addEventListener(this.eventName.SCROLL, () => {
        action();
      });
    });
  }

  _isBottom(target, list) {
    return target.scrollTop + target.offsetHeight >= list.offsetHeight;
  }

  enabledToggle(target, isEnabled) {
    if (isEnabled || isEnabled === undefined) {
      removeClass(target, className.DISABLED);
      target.style.cssText += `cursor: ${styleValue.CURSOR_INIT};`;
    } else {
      addClass(target, className.DISABLED);
      target.style.cssText += `cursor: ${styleValue.CURSOR_DEFAULT};`;
    }
  }
}

export { Element as default };
