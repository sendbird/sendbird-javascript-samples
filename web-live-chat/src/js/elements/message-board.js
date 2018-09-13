'use strict';

import Element from './element.js';
import { KeyCode } from '../adapter.js';

const MESSAGE_PREFIX = ' : ';
const LAST_MESSAGE_YESTERDAY = 'YESTERDAY';
const MORE_MESSAGE_BELOW = 'More message below.';

class MessageBoard extends Element {
  constructor() {
    super();
    this.setClass('message-board');

    let $content = new Element();
    $content.setClass('content');
    this.appendElement($content);

    let $contentInput = new Element();
    $contentInput.setClass('content-input');

    let $input = new Element('input');
    $input.setClass('input');
    $input.attr('contenteditable', true);

    $input.on('focus', () => {
      if(!$contentInput.hasClass('active'))
        $contentInput.addClass('active');
    });
    $input.on('blur', () => {
      if($contentInput.hasClass('active'))
        $contentInput.removeClass('active');
    });
    $input.on('keydown', (event) => {
      this.toggleIcon();
      if (event.keyCode === KeyCode.ENTER) {
        event.preventDefault();
        this.$icon.click();
        this.clearInput();
      }
    });
    $input.on('keyup', () => {
      this.toggleIcon();
    });
    $input.on('paste', (event) => {
      event.stopPropagation();
      event.preventDefault();

      const clipboardData = event.clipboardData || window.clipboardData;
      $input.appendContent(clipboardData.getData('Text'));
    });
    $contentInput.appendElement($input);

    let $icon = new Element();
    $icon.setClass([ 'icon' ]);
    $contentInput.appendElement($icon);
    this.appendElement($contentInput);

    this.$content = $content;
    this.$input = $input;
    this.$icon = $icon;
    this.reset();
  }

  getMessage() {
    return this.$input.val().trim();
  }

  createMessageElement(message) {
    let $item = new Element();
    $item.setClass('message-item');
    $item.attr('id', message.messageId);

    let $text = new Element();
    $text.setClass('message-text');

    let $nickname = new Element('label');
    let nicknameColor = this.senderColor[message.sender.userId];
    if (!nicknameColor) {
      nicknameColor = Math.floor((Math.random() * 12) + 1);
      nicknameColor = (nicknameColor < 10) ? '0' + nicknameColor.toString() : nicknameColor.toString();
      this.senderColor[message.sender.userId] = nicknameColor;
    }
    $nickname.setClass('nickname', 'nickname-color-' + nicknameColor);
    $nickname.val(message.sender.nickname + MESSAGE_PREFIX);

    $text.appendElement($nickname);
    $text.appendContent(message.message, {
      xssProtectionEnabled : true,
      showEndOfLine : true
    });
    $item.appendElement($text);

    let $time = new Element();
    $time.setClass('time');
    $time.val(this.getTime(message));
    $item.appendElement($time);
    return $item;
  }

  getTime(message) {
    const months = [
      'JAN', 'FEB', 'MAR', 'APR', 'MAY',
      'JUN', 'JUL', 'AUG', 'SEP', 'OCT',
      'NOV', 'DEC'
    ];

    var _getDay = (val) => {
      let day = parseInt(val);
      let digit = day % 10;
      switch(digit) {
      case 1:
        return day + 'st';
      case 2:
        return day + 'nd';
      case 3:
        return day + 'rd';
      default:
        return day + 'th';
      }
    };

    var _checkTime = (val) => {
      return (+val < 10) ? '0' + val : val;
    };

    if (message) {
      var _nowDate = new Date();
      var _date = new Date(message.createdAt);
      if (_nowDate.getDate() - _date.getDate() === 1) {
        return LAST_MESSAGE_YESTERDAY;
      } else if (_nowDate.getFullYear() === _date.getFullYear()
        && _nowDate.getMonth() === _date.getMonth()
        && _nowDate.getDate() === _date.getDate()) {
        return _checkTime(_date.getHours()) + ':' + _checkTime(_date.getMinutes());
      } else {
        return months[_date.getMonth()] + ' ' + _getDay(_date.getDate());
      }
    }
    return '';
  }

  render(messageList, isScrollBottom, isLoadingMore) {
    var moveScroll = 0;
    for (let i in messageList) {
      let message = messageList[i];
      if (message.isUserMessage()) {
        let $item = this.createMessageElement(message);
        if (isLoadingMore) {
          let firstChild = this.$content.first();
          this.$content.insertBefore($item, firstChild);
        } else {
          this.$content.appendElement($item);
        }
        moveScroll += $item.getFullHeight();
      } else {
        // put code here for other message type
      }
    }

    if (isLoadingMore) {
      this.$content.scrollY(moveScroll);
    }

    if (isScrollBottom) {
      this.$content.scrollToBottom();
    }
  }

  reset() {
    this.senderColor = {};
  }

  toggleIcon() {
    if (this.$input.val() && this.$input.val().length > 0) {
      if (!this.$icon.hasClass('active')) {
        this.$icon.addClass('active');
      }
    } else {
      this.$icon.removeClass('active');
    }
  }

  clearInput() {
    let items = this.$input.findByTag('div');
    for(let i = 0; i < items.length; i++) {
      items[i].remove();
    }
    this.$input.val('');
    this.toggleIcon();
  }

  createBottomBar() {
    let _this = this;
    let $btn = new Element();
    $btn.setClass('btn');
    $btn.val(MORE_MESSAGE_BELOW);
    $btn.on('click', () => {
      _this.$content.scrollToBottom();
      _this.removeBottomBar();
    });
    if (!this.$bottom) {
      this.appendElement($btn);
      this.$bottom = $btn;
    }
  }

  removeBottomBar() {
    if (this.$bottom) {
      this.removeElement(this.$bottom);
      this.$bottom = null;
    }
  }

}

export { MessageBoard as default };
