'use strict';

import Element from './element.js';
import {KeyCode} from '../adapter.js';

const TEXT_INPUT_USER_ID = 'USER ID';
const TEXT_INPUT_NICKNAME = 'NICKNAME';
const TEXT_LOGIN_BTN = 'Start Chat';

class LoginBoard extends Element {
  constructor(board) {
    super(board);
    this.setClass('login-board');

    let $userIdContainer = new Element();
    $userIdContainer.setClass('content', 'user-id');

    let $userIdText = new Element();
    $userIdText.setClass('input-text');
    $userIdText.val(TEXT_INPUT_USER_ID);
    $userIdContainer.appendElement($userIdText);

    let $userIdInput = this.$userId = new Element('input');
    $userIdInput.setClass('input');
    $userIdContainer.appendElement($userIdInput);
    this.appendElement($userIdContainer);

    let $nicknameContainer = new Element();
    $nicknameContainer.setClass('content', 'nickname');

    let $nicknameText = new Element();
    $nicknameText.setClass('input-text');
    $nicknameText.val(TEXT_INPUT_NICKNAME);
    $nicknameContainer.appendElement($nicknameText);

    let $nicknameInput = this.$nickname = new Element('input');
    $nicknameInput.setClass('input');
    $nicknameContainer.appendElement($nicknameInput);
    this.appendElement($nicknameContainer);

    let $login = this.$login = new Element();
    $login.setClass('btn', 'disabled');
    $login.val(TEXT_LOGIN_BTN);
    this.appendElement($login);

    let updateLoginButtonState = () => {
      if(this.$userId.val().trim() && this.$nickname.val().trim()) {
        $login.removeClass('disabled');
      } else {
        $login.addClass('disabled');
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
        if(!this.$login.hasClass('disabled')) {
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
      this.$login.setStyle('cursor', '');
    } else {
      this.$login.addClass('disabled');
      this.$login.setStyle('cursor', 'defaeult');
    }
  }

  onLogin(hdlr) {
    this.$login.on('click', hdlr);
  }
}

export { LoginBoard as default };
