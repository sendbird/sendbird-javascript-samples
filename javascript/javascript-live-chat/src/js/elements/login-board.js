'use strict';

import Element from './element.js';
import { KeyCode } from '../adapter.js';

const TEXT_INPUT_USER_ID = 'User ID';
const TEXT_INPUT_USER_ID_PLACEHOLDER = 'Enter your user ID';
const TEXT_INPUT_NICKNAME = 'Nickname';
const TEXT_INPUT_NICKNAME_PLACEHOLDER = 'Enter your nickname';
const TEXT_LOGIN_BTN = 'Start chat';

class LoginBoard extends Element {
  constructor(board) {
    super(board);
    this.setClass('login-board');

    const logo = new Element();
    logo.setClass('logo');
    this.appendElement(logo);

    const logoImage = new Element('img');
    logoImage.attr('src', 'https://dxstmhyqfqr1o.cloudfront.net/liveChat/icon-symbol-sb.svg');
    logo.appendElement(logoImage);

    const title = new Element();
    title.setClass('title');
    title.val('Sendbird Live chat sample');
    this.appendElement(title);

    let $userIdContainer = new Element();
    $userIdContainer.setClass('content', 'user-id');

    let $userIdText = new Element();
    $userIdText.setClass('input-text');
    $userIdText.val(TEXT_INPUT_USER_ID);
    $userIdContainer.appendElement($userIdText);

    let $userIdInput = (this.$userId = new Element('input'));
    $userIdInput.setClass('input');
    $userIdInput.attr('placeholder', TEXT_INPUT_USER_ID_PLACEHOLDER);
    $userIdContainer.appendElement($userIdInput);
    this.appendElement($userIdContainer);

    let $nicknameContainer = new Element();
    $nicknameContainer.setClass('content', 'nickname');

    let $nicknameText = new Element();
    $nicknameText.setClass('input-text');
    $nicknameText.val(TEXT_INPUT_NICKNAME);
    $nicknameContainer.appendElement($nicknameText);

    let $nicknameInput = (this.$nickname = new Element('input'));
    $nicknameInput.setClass('input');
    $nicknameInput.attr('placeholder', TEXT_INPUT_NICKNAME_PLACEHOLDER);
    $nicknameContainer.appendElement($nicknameInput);
    this.appendElement($nicknameContainer);

    let $login = (this.$login = new Element('button'));
    $login.setClass('btn', 'login', 'disabled');
    $login.val(TEXT_LOGIN_BTN);
    $login.attr('disabled', true);
    this.appendElement($login);

    let updateLoginButtonState = () => {
      if (this.$userId.val().trim() && this.$nickname.val().trim()) {
        $login.removeClass('disabled');
        $login.removeAttr('disabled');
      } else {
        $login.addClass('disabled');
        $login.attr('disabled', true);
      }
    };
    let userIdEventHandler = (event) => {
      if (event && event.keyCode === KeyCode.ENTER) {
        this.$nickname.focus();
      } else {
        updateLoginButtonState();
      }
    };
    let nicknameEventHandler = (event) => {
      if (event && event.keyCode === KeyCode.ENTER) {
        if (!this.$login.hasClass('disabled')) {
          this.$login.click();
        }
      } else {
        updateLoginButtonState();
      }
    };

    this.$userId.on('keyup', userIdEventHandler);
    this.$userId.on('change', userIdEventHandler);
    this.$nickname.on('keyup', nicknameEventHandler);
    this.$nickname.on('change', nicknameEventHandler);
  }

  disable() {
    this.$userId.disable();
    this.$nickname.disable();
    this.$login.addClass('disabled');
    this.$login.attr('disabled', true);
  }

  reset() {
    this.$userId.enable();
    this.$userId.val('');
    this.$nickname.enable();
    this.$nickname.val('');

    this.$login.val(TEXT_LOGIN_BTN);
    this.toggle(false);
  }

  toggle(isEnabled) {
    if (isEnabled || isEnabled === undefined) {
      this.$login.removeClass('disabled');
      this.$login.removeAttr('disabled');
      this.$login.setStyle('cursor', '');
    } else {
      this.$login.addClass('disabled');
      this.$login.attr('disabled', true);
      this.$login.setStyle('cursor', 'default');
    }
  }

  onLogin(hdlr) {
    this.$login.on('click', hdlr);
  }
}

export { LoginBoard as default };
