import { className, MAX_COUNT } from '../consts.js';
import Element from './elements.js';
import { show, hide, getFullHeight, removeClass, xssEscape } from '../utils.js';

const EMPTY_STRING = '';

const CHAT_SECTION_RIGHT_MAX = '280px';
const CHAT_SECTION_RIGHT_MIN = '60px';
const TOOLTIP_MEMBER_LIST = 'Member List';
const TOOLTIP_CHANNEL_LEAVE = 'Channel Leave';
const TOOLTIP_INVITE_MEMBER = 'Invite Member';
const TITLE_CHAT_TITLE_DEFAULT = 'Group Channel';
const TITLE_CHAT_TITLE_NEW_CHAT = 'New Chat';
const TITLE_CHAT_LEAVE_POPUP = 'Do you really want to leave?';
const TITLE_CHAT_LEAVE_BTN = 'Leave';
const TITLE_CHAT_CANCEL_BTN = 'Cancel';
const MEMBER_COUNT_DEFAULT = '0';
const MARGIN_TOP_MESSAGE = '3px';
const MESSAGE_NONE_IMAGE_HEIGHT = '10px';
const DISPLAY_NONE = 'none';
const TITLE_START_CHAT_BTN = 'Start Chat';
const MESSAGE_CONTENT_HEIGHT_DEFAULT = 328;
const MESSAGE_INPUT_HEIGHT_DEFAULT = 29;
const MESSAGE_TYPING_SEVERAL = 'Several people are typing...';
const MESSAGE_TYPING_MEMBER = ' is typing...';
const DISPLAY_TYPE_INLINE_BLOCK = 'inline-block';
const IMAGE_MAX_SIZE = 160;
const TEXT_FILE_DOWNLOAD = 'Download';

class ChatSection extends Element {
  constructor(widget) {
    super();
    this._create();
    widget.appendChild(this.self);
    this.textKr = '';
  }

  reset() {
    this._setContent(this.self, EMPTY_STRING);
  }

  _create() {
    this.self = this.createDiv();
    this._setClass(this.self, [className.CHAT_SECTION]);
  }

  responsiveSize(isMax, action) {
    if (isMax !== undefined) {
      this.self.style.cssText += `right: ${isMax ? CHAT_SECTION_RIGHT_MIN : CHAT_SECTION_RIGHT_MAX}`;
    }
    action();
  }

  _getListBoardArray() {
    return Array.prototype.slice.call(this.self.childNodes, 0);
  }

  moveToFirstIndex(target) {
    let items = this._getListBoardArray();
    items.filter(item => {
      if (item.id === target.id) {
        this.self.removeChild(item);
      }
    });
    this.self.insertBefore(target, this.self.firstChild);
  }

  setWidth(width) {
    this._setWidth(this.self, width);
  }

  /*
  Chat
   */
  createChatBoard(channelUrl, isLast) {
    let chatBoard = this.createDiv();
    this._setClass(chatBoard, [className.CHAT_BOARD]);
    chatBoard.id = channelUrl ? channelUrl : '';

    var chatTop = this.createDiv();
    this._setClass(chatTop, [className.TOP]);

    var chatTitle = this.createDiv();
    this._setClass(chatTitle, [className.TITLE]);
    this._setContent(chatTitle, TITLE_CHAT_TITLE_DEFAULT);
    chatBoard.topTitle = chatTitle;
    chatTop.appendChild(chatTitle);

    var chatMemberCount = this.createDiv();
    this._setClass(chatMemberCount, [className.COUNT]);
    this._setContent(chatMemberCount, MEMBER_COUNT_DEFAULT);
    chatBoard.count = chatMemberCount;
    chatTop.appendChild(chatMemberCount);

    var topBtnClose = this.createDiv();
    this._setClass(topBtnClose, [className.BTN, className.IC_CLOSE]);
    chatBoard.closeBtn = topBtnClose;
    chatTop.appendChild(topBtnClose);

    var topBtnLeave = this.createDiv();
    this._setClass(topBtnLeave, [className.BTN, className.IC_LEAVE]);
    chatBoard.leaveBtn = topBtnLeave;

    var tooltipLeave = this.createSpan();
    this._setClass(tooltipLeave, [className.TOOLTIP]);
    this._setContent(tooltipLeave, TOOLTIP_CHANNEL_LEAVE);

    topBtnLeave.appendChild(tooltipLeave);
    chatTop.appendChild(topBtnLeave);

    var topBtnMembers = this.createDiv();
    this._setClass(topBtnMembers, [className.BTN, className.IC_MEMBERS]);
    chatBoard.memberBtn = topBtnMembers;

    var tooltipMember = this.createSpan();
    this._setClass(tooltipMember, [className.TOOLTIP]);
    this._setContent(tooltipMember, TOOLTIP_MEMBER_LIST);

    topBtnMembers.appendChild(tooltipMember);
    chatTop.appendChild(topBtnMembers);

    var topBtnInvite = this.createDiv();
    this._setClass(topBtnInvite, [className.BTN, className.IC_INVITE]);
    chatBoard.inviteBtn = topBtnInvite;

    var tooltipInvite = this.createSpan();
    this._setClass(tooltipInvite, [className.TOOLTIP]);
    this._setContent(tooltipInvite, TOOLTIP_INVITE_MEMBER);

    topBtnInvite.appendChild(tooltipInvite);
    chatTop.appendChild(topBtnInvite);

    chatBoard.appendChild(chatTop);

    var chatContent = this.createDiv();
    this._setClass(chatContent, [className.CONTENT]);
    chatBoard.content = chatContent;
    chatBoard.appendChild(chatContent);

    isLast ? this.self.appendChild(chatBoard) : this.moveToFirstIndex(chatBoard);
    return chatBoard;
  }

  addLeavePopup(target) {
    if (!target.leavePopup) {
      var leavePopup = this.createDiv();
      this._setClass(leavePopup, [className.LEAVE_POPUP]);

      var leaveTitle = this.createDiv();
      this._setClass(leaveTitle, [className.POPUP_TOP]);
      this._setContent(leaveTitle, TITLE_CHAT_LEAVE_POPUP);
      leavePopup.appendChild(leaveTitle);

      var div = this.createDiv();
      var leaveBtn = this.createDiv();
      this._setClass(leaveBtn, [className.LEAVE_BTN]);
      this._setContent(leaveBtn, TITLE_CHAT_LEAVE_BTN);
      div.appendChild(leaveBtn);

      var cancelBtn = this.createDiv();
      this._setClickEvent(cancelBtn, () => {
        target.removeChild(leavePopup);
        target.leavePopup = null;
      });
      this._setClass(cancelBtn, [className.CANCEL_BTN]);
      this._setContent(cancelBtn, TITLE_CHAT_CANCEL_BTN);
      div.appendChild(cancelBtn);

      leavePopup.appendChild(div);

      target.leavePopup = leavePopup;
      target.leavePopup.leaveBtn = leaveBtn;
      target.insertBefore(leavePopup, target.firstChild);
    }
  }

  setLeaveBtnClickEvent(target, action) {
    this._setClickEvent(target, action);
  }

  removeMemberPopup() {
    let items = this.self.querySelectorAll('.' + className.CHAT_BOARD);
    for (var i = 0; i < items.length; i++) {
      let item = items[i];
      removeClass(item.memberBtn, className.ACTIVE);
    }
  }

  removeInvitePopup() {
    let items = this.self.querySelectorAll('.' + className.CHAT_BOARD);
    for (var i = 0; i < items.length; i++) {
      let item = items[i];
      removeClass(item.inviteBtn, className.ACTIVE);
    }
  }

  addClickEvent(target, action) {
    this._setClickEvent(target, action);
  }

  updateChatTop(target, count, title) {
    this._setContent(target.count, count);
    if (title !== null) {
      this._setContent(target.topTitle, title);
    }
  }

  getChatBoard(channelUrl) {
    let items = this.self.querySelectorAll('.' + className.CHAT_BOARD);
    let targetBoard;
    for (var i = 0; i < items.length; i++) {
      let item = items[i];
      if (item.id == channelUrl) {
        targetBoard = item;
        break;
      }
    }
    return targetBoard;
  }

  indexOfChatBord(channelUrl) {
    var items = this.self.querySelectorAll('.' + className.CHAT_BOARD);
    let chatBoard = this.getChatBoard(channelUrl);
    let index = -1;
    for (var i = 0; i < items.length; i++) {
      if (items[i] == chatBoard) {
        index = i;
        break;
      }
    }
    return index;
  }

  closeChatBoard(target) {
    target.parentNode.removeChild(target);
    this.textKr = '';
  }

  createMessageContent(target) {
    var chatContent = this.createDiv();
    this._setClass(chatContent, [className.CONTENT]);

    var messageContent = this.createDiv();
    this._setClass(messageContent, [className.MESSAGE_CONTENT]);

    var messageList = this.createDiv();
    this._setClass(messageList, [className.MESSAGE_LIST]);
    messageContent.appendChild(messageList);
    chatContent.appendChild(messageContent);

    var typingMessage = this.createDiv();
    this._setClass(typingMessage, [className.TYPING]);
    chatContent.appendChild(typingMessage);

    var contentInput = this.createDiv();
    this._setClass(contentInput, [className.INPUT]);

    var chatText = this.createTextInput();
    contentInput.appendChild(chatText);

    var chatFile = this.createLabel();
    this._setClass(chatFile, [className.FILE]);
    chatFile.setAttribute('for', 'file_' + target.id);

    var chatFileInput = this.createInput();
    chatFileInput.type = 'file';
    chatFileInput.name = 'file';
    chatFileInput.id = 'file_' + target.id;
    hide(chatFileInput);
    chatFile.appendChild(chatFileInput);
    contentInput.appendChild(chatFile);
    chatContent.appendChild(contentInput);

    target.content.parentNode.removeChild(target.content);
    target.content = chatContent;
    target.messageContent = messageContent;
    target.list = messageList;
    target.typing = typingMessage;
    target.input = chatText;
    target.file = chatFileInput;
    target.appendChild(chatContent);
  }

  createTextInput() {
    var chatText = this.createDiv();
    this._setClass(chatText, [className.TEXT]);
    chatText.setAttribute('contenteditable', true);
    return chatText;
  }

  clearInputText(target, channelUrl) {
    let items = target.querySelectorAll(this.tagName.DIV);
    for (var i = 0; i < items.length; i++) {
      let item = items[i];
      item.remove();
    }
    this._setContent(target, EMPTY_STRING);
    this.responsiveHeight(channelUrl);
  }

  addPasteEvent(target, action) {
    this._setPasteEvent(target, action);
  }

  addKeyUpEvent(target, action) {
    this._setKeyupEvent(target, action);
  }

  addKeyDownEvent(target, action) {
    this._setKeydownEvent(target, action);
  }

  addFileSelectEvent(target, action) {
    this._setChangeEvent(target, action);
  }

  addScrollEvent(target, action) {
    this._setScrollEvent(target, action);
  }

  responsiveHeight(channelUrl) {
    let targetBoard = this.getChatBoard(channelUrl);
    let messageContent = targetBoard.messageContent;
    let changeHeight = getFullHeight(targetBoard.typing) + getFullHeight(targetBoard.input);
    this._setHeight(messageContent, MESSAGE_CONTENT_HEIGHT_DEFAULT - (changeHeight - MESSAGE_INPUT_HEIGHT_DEFAULT));
  }

  showTyping(channel, spinner) {
    let targetBoard = this.getChatBoard(channel.url);
    let typing = targetBoard.typing;
    if (!channel.isTyping()) {
      this._setContent(typing, EMPTY_STRING);
      hide(typing);
    } else {
      let typingUser = channel.getTypingMembers();
      spinner.insert(typing);
      this._addContent(
        typing,
        typingUser.length > 1 ? MESSAGE_TYPING_SEVERAL : xssEscape(typingUser[0].nickname) + MESSAGE_TYPING_MEMBER
      );
      show(typing);
    }
  }

  _imageResize(imageTarget, width, height) {
    let scaleWidth = IMAGE_MAX_SIZE / width;
    let scaleHeight = IMAGE_MAX_SIZE / height;

    let scale = scaleWidth <= scaleHeight ? scaleWidth : scaleHeight;
    if (scale > 1) {
      scale = 1;
    }

    let resizeWidth = width * scale;
    let resizeHeight = height * scale;

    this._setBackgroundSize(imageTarget, resizeWidth + 'px ' + resizeHeight + 'px');
    this._setWidth(imageTarget, resizeWidth);
    this._setHeight(imageTarget, resizeHeight);
    return { resizeWidth: resizeWidth, resizeHeight: resizeHeight };
  }

  setImageSize(target, message) {
    this._setBackgroundImage(target, message.thumbnails.length > 0 ? message.thumbnails[0].url : message.url);
    if (message.thumbnails.length > 0) {
      this._imageResize(target, message.thumbnails[0].real_width, message.thumbnails[0].real_height);
    } else {
      var img = new Image();
      img.addEventListener('load', res => {
        res.path
          ? this._imageResize(target, res.path[0].width, res.path[0].height)
          : this._imageResize(target, res.target.width, res.target.height);
      });
      img.src = message.url;
    }
  }

  createMessageItem(message, isCurrentUser, isContinue, unreadCount) {
    var messageSet = this.createDiv();
    messageSet.id = message.messageId;
    this._setClass(messageSet, isCurrentUser ? [className.MESSAGE_SET, className.USER] : [className.MESSAGE_SET]);
    if (isContinue) {
      messageSet.style.cssText += `margin-top: ${MARGIN_TOP_MESSAGE}`;
    }

    var senderImg = this.createDiv();
    this._setClass(senderImg, [className.IMAGE]);
    var senderProfile = message.sender.profileUrl;
    if (isContinue) {
      senderProfile = '';
      senderImg.style.cssText += `height: ${MESSAGE_NONE_IMAGE_HEIGHT};`;
    }
    senderImg.style.cssText += `background-image: url(${senderProfile});`;
    messageSet.appendChild(senderImg);

    var messageContent = this.createDiv();
    this._setClass(messageContent, [className.MESSAGE]);

    var senderNickname = this.createDiv();
    this._setClass(senderNickname, [className.NICKNAME]);
    this._setContent(senderNickname, xssEscape(message.sender.nickname));
    if (isContinue) {
      senderNickname.style.cssText += `display: ${DISPLAY_NONE};`;
    }
    messageContent.appendChild(senderNickname);

    var messageItem = this.createDiv();
    this._setClass(messageItem, [className.MESSAGE_ITEM]);

    var itemText = this.createDiv();
    if (message.isUserMessage()) {
      this._setClass(itemText, [className.TEXT]);
      var urlexp = new RegExp(
        '(http|https)://[a-z0-9-_]+(.[a-z0-9-_]+)+([a-z0-9-.,@?^=%&;:/~+#]*[a-z0-9-@?^=%&;/~+#])?',
        'i'
      );
      var _message = message.message;
      if (urlexp.test(_message)) {
        _message =
          '<a href="' +
          _message +
          (isCurrentUser
            ? '" target="_blank" style="color: #FFFFFF;">'
            : '" target="_blank" style="color: #444444;">') +
          _message +
          '</a>';
        if (message.customType === 'url_preview') {
          let previewData = JSON.parse(message.data);

          var _siteName = this.createDiv();
          this._setClass(_siteName, [className.PREVIEW_NAME]);
          this._setContent(_siteName, '@' + previewData.site_name);

          var _title = this.createDiv();
          this._setClass(_title, [className.PREVIEW_TITLE]);
          this._setContent(_title, previewData.title);

          var _description = this.createDiv();
          this._setClass(_description, [className.PREVIEW_DESCRIPTION]);
          this._setContent(_description, previewData.description);

          var _image = this.createDiv();
          this._setClass(_image, [className.PREVIEW_IMAGE]);
          this._setBackgroundImage(_image, previewData.image);

          _message += '<hr>' + _siteName.outerHTML + _title.outerHTML + _description.outerHTML + _image.outerHTML;
        }
      } else {
        _message = xssEscape(_message);
      }
      this._setContent(itemText, _message);
    } else if (message.isFileMessage()) {
      if (message.type.match(/^image\/gif$/)) {
        this._setClass(itemText, [className.FILE_MESSAGE]);
        let image = this.createImg();
        this._setClass(image, [className.IMAGE]);
        image.src = message.url;
        this.setImageSize(image, message);
        itemText.appendChild(image);
      } else if (message.type.match(/^video\/.+$/)) {
        this._setClass(itemText, [className.FILE_MESSAGE]);
        let video = this.createVideo();
        video.controls = true;
        video.preload = 'auto';
        var resize = { resizeWidth: 160, resizeHeight: 160 };
        if (message.thumbnails && message.thumbnails.length > 0) {
          video.poster = message.thumbnails[0].url;
          resize = this._imageResize(video, message.thumbnails[0].real_width, message.thumbnails[0].real_height);
          video.width = resize.resizeWidth;
          video.height = resize.resizeHeight;
        } else {
          var _self = this;
          video.addEventListener('loadedmetadata', function() {
            resize = _self._imageResize(video, this.videoWidth, this.videoHeight);
            video.width = resize.resizeWidth;
            video.height = resize.resizeHeight;
          });
        }
        video.src = message.url;
        itemText.appendChild(video);
      } else {
        this._setClass(itemText, [className.FILE_MESSAGE]);
        let file = this.createA();
        file.href = message.url;
        file.target = 'blank';
        if (message.type.match(/^image\/.+$/)) {
          this._setClass(file, [className.IMAGE]);
          this.setImageSize(file, message);
        } else {
          this._setClass(file, [className.FILE]);
          var fileIcon = this.createDiv();
          this._setClass(fileIcon, [className.FILE_ICON]);

          var fileText = this.createDiv();
          this._setClass(fileText, [className.FILE_TEXT]);

          var fileName = this.createDiv();
          this._setClass(fileName, [className.FILE_NAME]);
          this._setContent(fileName, xssEscape(message.name));
          fileText.appendChild(fileName);

          var fileDownload = this.createDiv();
          this._setClass(fileDownload, [className.FILE_DOWNLOAD]);
          this._setContent(fileDownload, TEXT_FILE_DOWNLOAD);
          fileText.appendChild(fileDownload);

          file.appendChild(fileIcon);
          file.appendChild(fileText);
        }
        itemText.appendChild(file);
      }
    }

    var itemUnread = this.createDiv();
    this._setClass(itemUnread, [className.UNREAD]);
    this.setUnreadCount(itemUnread, unreadCount);
    messageSet.unread = itemUnread;

    if (isCurrentUser) {
      messageItem.appendChild(itemUnread);
      messageItem.appendChild(itemText);
    } else {
      messageItem.appendChild(itemText);
      messageItem.appendChild(itemUnread);
    }

    messageContent.appendChild(messageItem);
    messageSet.appendChild(messageContent);
    return messageSet;
  }

  createAdminMessageItem(message) {
    var admin = this.createDiv();
    this._setClass(admin, [className.MESSAGE_SET, className.ADMIN_MESSAGE]);
    this._setContent(admin, xssEscape(message.message));
    return admin;
  }

  setUnreadCount(target, count) {
    count = parseInt(count);
    this._setContent(target, count > 9 ? MAX_COUNT : count == 0 ? '' : count.toString());
    count > 0 ? show(target, DISPLAY_TYPE_INLINE_BLOCK) : hide(target);
  }

  updateReadReceipt(channelSet, target) {
    var items = target.querySelectorAll('.' + className.MESSAGE_SET);
    for (var j = 0; j < channelSet.message.length; j++) {
      let message = channelSet.message[j];
      for (var i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.id == message.messageId) {
          this.setUnreadCount(item.unread, channelSet.channel.getReadReceipt(message));
          break;
        }
      }
    }
  }

  createMessageItemTime(date) {
    var time = this.createDiv();
    this._setClass(time, [className.MESSAGE_SET, className.TIME]);
    this._setContent(time, date);
    return time;
  }

  createNewChatBoard(target) {
    var chatContent = this.createDiv();
    this._setClass(chatContent, [className.CONTENT]);

    var userContent = this.createDiv();
    this._setClass(userContent, [className.USER_CONTENT]);
    chatContent.appendChild(userContent);

    var contentBottom = this.createDiv();
    this._setClass(contentBottom, [className.CONTENT_BOTTOM]);

    var contentBottomBtn = this.createDiv();
    this._setClass(contentBottomBtn, [className.NEW_CHAT_BTN, className.DISABLED]);
    this._setContent(contentBottomBtn, TITLE_START_CHAT_BTN);
    contentBottom.appendChild(contentBottomBtn);
    chatContent.appendChild(contentBottom);

    target.content.parentNode.removeChild(target.content);
    target.content = chatContent;
    target.startBtn = contentBottomBtn;
    target.userContent = userContent;
    target.appendChild(chatContent);
    this._setContent(target.topTitle, TITLE_CHAT_TITLE_NEW_CHAT);
  }

  createUserList(target) {
    if (target.querySelectorAll(this.tagName.UL).length == 0) {
      var userList = this.createUl();
      target.list = userList;
      target.appendChild(userList);
    }
  }

  createUserListItem(user) {
    var li = this.createLi();

    var userItem = this.createDiv();
    this._setClass(userItem, [className.USER_ITEM]);

    var userSelect = this.createDiv();
    this._setClass(userSelect, [className.USER_SELECT]);
    this._setDataset(userSelect, 'user-id', user.userId);
    li.select = userSelect;
    userItem.appendChild(userSelect);

    var userProfile = this.createDiv();
    this._setClass(userProfile, [className.IMAGE]);
    this._setBackgroundImage(userProfile, user.profileUrl);
    userItem.appendChild(userProfile);

    var userNickname = this.createDiv();
    this._setClass(userNickname, [className.NICKNAME]);
    this._setContent(userNickname, xssEscape(user.nickname));
    userItem.appendChild(userNickname);

    li.appendChild(userItem);
    return li;
  }

  getSelectedUserIds(target) {
    let items = target.querySelectorAll('.' + className.ACTIVE);
    var userIds = [];
    for (var i = 0; i < items.length; i++) {
      let item = items[i];
      userIds.push(item.getAttribute('data-user-id'));
    }
    return userIds;
  }

  isBottom(targetContent, targetList) {
    return this._isBottom(targetContent, targetList);
  }

  addUserListScrollEvent(target, action) {
    this._setScrollEvent(target.userContent, () => {
      if (this.isBottom(target.userContent, target.userContent.list)) {
        action();
      }
    });
  }

  scrollToBottom(target) {
    target.scrollTop = target.scrollHeight - target.clientHeight;
  }
}

export { ChatSection as default };
