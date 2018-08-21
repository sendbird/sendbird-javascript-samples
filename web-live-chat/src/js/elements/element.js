'use strict';

import '../../scss/chat.scss';

class Element {
  constructor(arg) {
    this.supportedTags = [ 'div', 'span', 'input', 'label' ];
    this.supportedEvents = [
      'click', 'keydown', 'keyup', 'scroll',
      'paste', 'change', 'focus', 'blur'
    ];
    if(!arg || typeof arg === 'string') {
      let tag = (this.supportedTags.indexOf(arg) >= 0) ? arg : 'div';
      this.$ = document.createElement(tag);
    } else if(arg instanceof HTMLElement) {
      this.$ = arg;
    }
  }

  setClass(...args) {
    if(this.$) {
      return this.$.className = args.join(' ');
    }
  }

  hasClass(className) {
    if(this.$) {
      if(this.$.classList) {
        return this.$.classList.contains(className);
      } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(this.$.className);
      }
    } else {
      return false;
    }
  }

  addClass(className) {
    if(this.$) {
      let classList = this.$.className.split(' ');
      if(!(className in classList)) {
        classList.push(className);
        this.$.className = classList.join(' ');
      }
    }
    return this.$;
  }

  removeClass(className) {
    if(this.$) {
      if(this.$.classList) {
        this.$.classList.remove(className);
      } else {
        this.$.className = this.$.className
          .replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), '');
      }
    }
    return this.$;
  }

  findByTag(tag) {
    return this.$.querySelectorAll(tag);
  }

  getTag() {
    return this.$ ? this.$.tagName.toUpperCase() : '';
  }

  setStyle(style, value, unit = '') {
    if(this.$) {
      this.$.style[style] = value + unit;
    }
  }

  focus() {
    if(this.$) {
      this.$.focus();
    }
  }

  blur() {
    if(this.$) {
      this.$.blur();
    }
  }

  click() {
    if(this.$) {
      this.$.click();
    }
  }

  attr(key, val) {
    if(this.$) {
      if(val !== undefined) {
        this.$.setAttribute(key, val);
      }
      return this.$.getAttribute(key);
    }
  }

  protectFromXSS(text) {
    return text
      .replace(/\&/g, '&amp;')
      .replace(/\#/g, '&#35;')
      .replace(/\</g, '&lt;')
      .replace(/\>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&apos;')
      .replace(/\+/g, '&#43;')
      .replace(/\-/g, '&#45;')
      .replace(/\(/g, '&#40;')
      .replace(/\)/g, '&#41;')
      .replace(/\%/g, '&#37;');
  }

  val(newVal, options) {
    if(this.$) {
      if (!options) options = {};

      if (this.getTag() === 'INPUT') {
        if (newVal !== undefined) {
          this.$.value = newVal;
        }
        return this.$.value || '';
      } else {
        if (newVal !== undefined) {
          if (options.xssProtectionEnabled) {
            newVal = this.protectFromXSS(newVal);
          }
          if(options.showEndOfLine) {
            newVal = newVal.replace(/\n/g, '<br />');
          }
          this.$.innerHTML = newVal;
        }
        return this.$.innerHTML;
      }
    } else {
      return '';
    }
  }

  appendContent(text, options) {
    if(this.$) {
      if(!options) options = {};
      if(options.xssProtectionEnabled) {
        text = this.protectFromXSS(text);
      }
      if(options.showEndOfLine) {
        text = text.replace(/\n/g, '<br />');
      }
      this.val(this.val() + text);
    }
    return this.val();
  }

  enable() {
    if(this.$) {
      this.$.disabled = false;
    }
  }

  disable() {
    if(this.$) {
      this.$.disabled = true;
    }
  }

  first() {
    return this.$.firstChild;
  }

  last() {
    return this.$.lastChild;
  }

  children() {
    return this.$.children;
  }

  insertBefore(elem, before) {
    if(this.$) {
      if(elem instanceof Element) elem = elem.$;
      if(before instanceof Element) before = before.$;
      this.$.insertBefore(elem, before);
    }
    return this.$;
  }

  appendElement(elem) {
    if(this.$) {
      if(elem instanceof HTMLElement) {
        this.$.appendChild(elem);
      } else {
        this.$.appendChild(elem.$);
      }
    }
    return this.$;
  }

  replaceElement(from, to) {
    if(this.$) {
      if(from instanceof Element) from = from.$;
      if(to instanceof Element) to = to.$;
      this.$.replaceChild(to, from);
    }
  }

  removeElement(elem) {
    if(this.$) {
      if(elem instanceof HTMLElement) {
        this.$.removeChild(elem);
      } else {
        this.$.removeChild(elem.$);
      }
    }
  }

  removeFirst() {
    if(this.$.children.length > 0) {
      this.$.removeChild(this.$.firstChild);
    }
  }

  removeLast() {
    if(this.$.children.length > 0) {
      this.$.removeChild(this.$.lastChild);
    }
  }

  getFullWidth() {
    let width = this.$.offsetWidth;
    let style = getComputedStyle(this.$);
    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
  }

  getFullHeight() {
    let height = this.$.offsetHeight;
    let style = getComputedStyle(this.$);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  }

  getScrollHeight() {
    return this.$.scrollHeight;
  }

  getScrollX() {
    return this.$.scrollLeft;
  }

  getScrollY() {
    return this.$.scrollTop;
  }

  scroll(x, y) {
    this.scrollX(x);
    this.scrollY(y);
  }

  scrollX(x) {
    this.$.scrollLeft = x;
  }

  scrollY(y) {
    this.$.scrollTop = y;
  }

  scrollToTop() {
    this.scrollY(0);
  }

  scrollToBottom() {
    this.scrollY(this.$.scrollHeight - this.$.clientHeight);
  }

  isScrollBottom() {
    return this.getScrollY() === this.$.scrollHeight - this.$.clientHeight;
  }

  on(type, hdlr) {
    if(this.$) {
      type = (this.supportedEvents.indexOf(type) >= 0) ? type : null;
      if(type) {
        this.$.addEventListener(type, hdlr);
      }
    }
  }
}

export { Element as default };
