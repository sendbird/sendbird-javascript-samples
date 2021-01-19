'use strict';

import Element from './element.js';
import { KeyCode } from '../adapter.js';

const MESSAGE_PREFIX = ' : ';
const LAST_MESSAGE_YESTERDAY = 'YESTERDAY';
const MORE_MESSAGE_BELOW = 'More message below.';
const INPUT_MESSAGE_PLACEHOLDER = 'Type a message';

const MAX_MESSAGE_COUNT = 100;

class MessageBoard extends Element {
  constructor() {
    super();
    this.setClass('message-board');

    const top = new Element();
    top.setClass('top');
    this.appendElement(top);

    const topText = new Element();
    topText.setClass('top-text');
    topText.val('Live chat');
    top.appendElement(topText);

    const leave = new Element('button');
    leave.setClass('btn', 'leave');
    leave.setStyle('cursor', 'default');
    top.appendElement(leave);

    const leaveIcon = new Element('img');
    leaveIcon.setClass('leave-icon');
    leaveIcon.attr('src', 'https://dxstmhyqfqr1o.cloudfront.net/liveChat/icon-leave.svg');
    leave.appendElement(leaveIcon);

    const separator = new Element();
    separator.setClass('separator');
    this.appendElement(separator);

    let $content = new Element();
    $content.setClass('content');
    this.appendElement($content);

    let $contentInput = new Element();
    $contentInput.setClass('content-input');

    let $input = new Element('input');
    $input.setClass('input');
    $input.attr('contenteditable', true);
    $input.attr('placeholder', INPUT_MESSAGE_PLACEHOLDER);

    $input.on('focus', () => {
      if (!$contentInput.hasClass('active')) $contentInput.addClass('active');
    });
    $input.on('blur', () => {
      if ($contentInput.hasClass('active')) $contentInput.removeClass('active');
    });
    $input.on('keydown', (event) => {
      this.toggleIcon();
      if (event.keyCode === KeyCode.ENTER) {
        event.preventDefault();
        this.send.click();
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
    this.appendElement($contentInput);

    const send = new Element();
    send.setClass('btn', 'send');
    $contentInput.appendElement(send);

    const sendIcon = new Element('img');
    sendIcon.setClass('send-icon');
    sendIcon.attr('src', 'https://dxstmhyqfqr1o.cloudfront.net/liveChat/icon-send.svg');
    send.appendElement(sendIcon);

    this.leave = leave;
    this.$content = $content;
    this.$input = $input;
    this.send = send;
    this.reset();
  }

  getMessage() {
    return this.$input.val().trim();
  }

  createMessageElement(message) {
    let $item = new Element();
    $item.setClass('message-item');
    $item.attr('id', message.messageId);

    const profile = new Element();
    profile.setClass('profile');
    $item.appendElement(profile);

    const profileImage = new Element('img');
    profileImage.setClass('profile-image');
    profileImage.attr('src', message.sender.profileUrl);
    profile.appendElement(profileImage);

    let $text = new Element();
    $text.setClass('message-text');

    let $nickname = new Element('label');
    let nicknameColor = this.senderColor[message.sender.userId];
    if (!nicknameColor) {
      nicknameColor = Math.floor(Math.random() * 6 + 1);
      nicknameColor = nicknameColor < 10 ? '0' + nicknameColor.toString() : nicknameColor.toString();
      this.senderColor[message.sender.userId] = nicknameColor;
    }
    $nickname.setClass('nickname', 'nickname-color-' + nicknameColor);
    $nickname.val(message.sender.nickname);

    $text.appendElement($nickname);

    const messageContent = new Element('span');
    messageContent.setClass('message-content');
    messageContent.appendContent(message.message, {
      xssProtectionEnabled: true,
      showEndOfLine: true,
    });
    $text.appendElement(messageContent);

    $item.appendElement($text);

    // let $time = new Element();
    // $time.setClass('time');
    // $time.val(this.getTime(message));
    // $item.appendElement($time);
    return $item;
  }

  // getTime(message) {
  //   const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  //   var _getDay = (val) => {
  //     let day = parseInt(val);
  //     let digit = day % 10;
  //     switch (digit) {
  //       case 1:
  //         return day + 'st';
  //       case 2:
  //         return day + 'nd';
  //       case 3:
  //         return day + 'rd';
  //       default:
  //         return day + 'th';
  //     }
  //   };

  //   var _checkTime = (val) => {
  //     return +val < 10 ? '0' + val : val;
  //   };

  //   if (message) {
  //     var _nowDate = new Date();
  //     var _date = new Date(message.createdAt);
  //     if (_nowDate.getDate() - _date.getDate() === 1) {
  //       return LAST_MESSAGE_YESTERDAY;
  //     } else if (
  //       _nowDate.getFullYear() === _date.getFullYear() &&
  //       _nowDate.getMonth() === _date.getMonth() &&
  //       _nowDate.getDate() === _date.getDate()
  //     ) {
  //       return _checkTime(_date.getHours()) + ':' + _checkTime(_date.getMinutes());
  //     } else {
  //       return months[_date.getMonth()] + ' ' + _getDay(_date.getDate());
  //     }
  //   }
  //   return '';
  // }

  render(messageList, isLoadingMore, scrollToBottom, newMessage) {
    const isScrollBottom = this.$content.isScrollBottom();
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

    if (scrollToBottom) {
      this.$content.scrollToBottom();
    } else if (isScrollBottom) {
      this.$content.scrollToBottom();
      this.clearOverflowedMessages();
    } else if (newMessage) {
      this.createBottomBar();
    }
  }

  reset() {
    this.senderColor = {};
  }

  toggleIcon() {
    if (this.$input.val() && this.$input.val().length > 0) {
      if (!this.send.hasClass('active')) {
        this.send.addClass('active');
      }
    } else {
      this.send.removeClass('active');
    }
  }

  clearInput() {
    let items = this.$input.findByTag('div');
    for (let i = 0; i < items.length; i++) {
      items[i].remove();
    }
    this.$input.val('');
    this.toggleIcon();
  }

  createBottomBar() {
    let _this = this;
    let $btn = new Element();
    $btn.setClass('btn', 'scroll-to-bottom');
    // $btn.val(MORE_MESSAGE_BELOW);
    $btn.on('click', () => {
      _this.$content.scrollToBottom();
      _this.removeBottomBar();
    });

    const image = new Element('img');
    image.setClass('icon');
    image.attr('src', 'https://dxstmhyqfqr1o.cloudfront.net/liveChat/icon-chevron-down.svg');
    $btn.appendElement(image);

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

  clearOverflowedMessages() {
    let $messages = this.$content.children();
    let overCount = $messages.length - MAX_MESSAGE_COUNT;
    if (overCount > 0) {
      for (let i = 0; i < overCount; i++) {
        this.$content.removeFirst();
      }
    }
  }
}

export { MessageBoard as default };
