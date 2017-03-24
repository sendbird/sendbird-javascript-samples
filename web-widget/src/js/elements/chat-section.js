import { className, MAX_COUNT } from '../consts.js';
import Element from './elements.js';
import { show, hide, getFullHeight, removeClass } from '../utils.js';

const EMPTY_STRING = '';

const CHAT_SECTION_RIGHT_MAX = '280px';
const CHAT_SECTION_RIGHT_MIN = '60px';
const TOOLTIP_MEMBER_LIST = 'Member List';
const TOOLTIP_INVITE_MEMBER = 'Invite Member';
const TITLE_CHAT_TITLE_DEFAULT = 'Group Channel';
const TITLE_CHAT_TITLE_NEW_CHAT = 'New Chat';
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
      this.self.style.right = isMax ? CHAT_SECTION_RIGHT_MIN : CHAT_SECTION_RIGHT_MAX;
    }
    action();
  }

  _getListBoardArray() {
    return Array.prototype.slice.call(this.self.childNodes, 0);
  }

  moveToFirstIndex(target) {
    let items = this._getListBoardArray();
    items.filter((item) => {
      if (item.id == target.id) {
        this.self.removeChild(item);
      }
    });
    this.self.insertBefore(target, this.self.firstChild);
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

  removeMemberPopup() {
    let items = this.self.querySelectorAll('.' + className.CHAT_BOARD);
    for (var i = 0 ; i < items.length ; i++) {
      let item = items[i];
      removeClass(item.memberBtn, className.ACTIVE);
    }
  }

  removeInvitePopup() {
    let items = this.self.querySelectorAll('.' + className.CHAT_BOARD);
    for (var i = 0 ; i < items.length ; i++) {
      let item = items[i];
      removeClass(item.inviteBtn, className.ACTIVE);
    }
  }

  addClickEvent(target, action) {
    this._setClickEvent(target, action);
  }

  updateChatTop(target, count, title) {
    this._setContent(target.count, count);
    if (title) {
      this._setContent(target.topTitle, title);
    }
  }

  getChatBoard(channelUrl) {
    let items = this.self.querySelectorAll('.' + className.CHAT_BOARD);
    let targetBoard;
    for (var i = 0 ; i < items.length ; i++) {
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
    for (var i = 0 ; i < items.length ; i++) {
      if (items[i] == chatBoard) {
        index = i;
        break;
      }
    }
    return index;
  }

  closeChatBoard(target) {
    target.remove();
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

    target.content.remove();
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

  clearInputText(target) {
    let items = target.querySelectorAll(this.tagName.DIV);
    for (var i = 0 ; i < items.length ; i++) {
      let item = items[i];
      item.remove();
    }
    this._setContent(target, EMPTY_STRING);
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
    let changeHeight = (getFullHeight(targetBoard.typing) + getFullHeight(targetBoard.input));
    this._setHeight(
      messageContent,
      (MESSAGE_CONTENT_HEIGHT_DEFAULT - (changeHeight - MESSAGE_INPUT_HEIGHT_DEFAULT))
    );
  }

  showTyping(channel) {
    let targetBoard = this.getChatBoard(channel.url);
    let typing = targetBoard.typing;
    if (!channel.isTyping()) {
      this._setContent(typing, EMPTY_STRING);
      hide(typing);
    } else {
      let typingUser = channel.getTypingMembers();
      this._setContent(typing, (typingUser.length > 1) ? MESSAGE_TYPING_SEVERAL : typingUser[0].nickname + MESSAGE_TYPING_MEMBER);
      show(typing);
    }
  }

  setImageSize(target, message) {

    var imageResize = (imageTarget, width, height) => {
      let scaleWidth = IMAGE_MAX_SIZE / width;
      let scaleHeight = IMAGE_MAX_SIZE / height;

      let scale = (scaleWidth <= scaleHeight) ? scaleWidth : scaleHeight;
      if (scale > 1) {
        scale = 1;
      }

      let resizeWidth = (width * scale);
      let resizeHeight = (height * scale);

      this._setBackgroundSize(imageTarget, resizeWidth + 'px ' + resizeHeight + 'px');
      this._setWidth(imageTarget, resizeWidth);
      this._setHeight(imageTarget, resizeHeight);
    };

    this._setBackgroundImage(target, (message.thumbnails.length > 0) ? message.thumbnails[0].url : message.url);
    if (message.thumbnails.length > 0) {
      imageResize(target, message.thumbnails[0].real_width, message.thumbnails[0].real_height);
    } else {
      var img = new Image();
      img.addEventListener('load', (res) => {
        imageResize(target, res.path[0].width, res.path[0].height);
        img.remove();
      });
      img.src = message.url;
    }
  }

  createMessageItem(message, isCurrentUser, isContinue, unreadCount) {
    var messageSet = this.createDiv();
    messageSet.id = message.messageId;
    this._setClass(messageSet, isCurrentUser ? [className.MESSAGE_SET, className.USER] : [className.MESSAGE_SET]);
    if (isContinue) {
      messageSet.style.marginTop = MARGIN_TOP_MESSAGE;
    }

    var senderImg = this.createDiv();
    this._setClass(senderImg, [className.IMAGE]);
    var senderProfile = message.sender.profileUrl;
    if (isContinue) {
      senderProfile = '';
      senderImg.style.height = MESSAGE_NONE_IMAGE_HEIGHT;
    }
    senderImg.style.backgroundImage = 'url(' + senderProfile + ')';
    messageSet.appendChild(senderImg);

    var messageContent = this.createDiv();
    this._setClass(messageContent, [className.MESSAGE]);

    var senderNickname = this.createDiv();
    this._setClass(senderNickname, [className.NICKNAME]);
    this._setContent(senderNickname, message.sender.nickname);
    if (isContinue) {
      senderNickname.style.display = DISPLAY_NONE;
    }
    messageContent.appendChild(senderNickname);

    var messageItem = this.createDiv();
    this._setClass(messageItem, [className.MESSAGE_ITEM]);

    var itemText;
    if (message.isUserMessage()) {
      itemText = this.createDiv();
      this._setClass(itemText, [className.TEXT]);
      this._setContent(itemText, message.message);
    } else if (message.isFileMessage()) {
      if (message.type.match(/^image\/gif$/)) {
        itemText = this.createImg();
        this._setClass(itemText, [className.IMAGE]);
        itemText.src = message.url;
        this.setImageSize(itemText, message);
      } else {
        itemText = this.createA();
        itemText.href = message.url;
        itemText.target = 'blank';
        if (message.type.match(/^image\/.+$/)) {
          this._setClass(itemText, [className.IMAGE]);
          this.setImageSize(itemText, message);
        } else {
          this._setClass(itemText, [className.FILE]);
          var fileIcon = this.createDiv();
          this._setClass(fileIcon, [className.FILE_ICON]);

          var fileName = this.createDiv();
          this._setClass(fileName, [className.FILE_NAME]);
          this._setContent(fileName, message.name);

          if (isCurrentUser) {
            itemText.appendChild(fileName);
            itemText.appendChild(fileIcon);
          } else {
            itemText.appendChild(fileIcon);
            itemText.appendChild(fileName);
          }
        }
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

  setUnreadCount(target, count) {
    count = parseInt(count);
    this._setContent(target, (count > 9) ? MAX_COUNT : count.toString());
    (count > 0) ? show(target, DISPLAY_TYPE_INLINE_BLOCK) : hide(target);
  }

  updateReadReceipt(channelSet, target) {
    var items = target.querySelectorAll('.' + className.MESSAGE_SET);
    for (var j = 0 ; j < channelSet.message.length ; j++) {
      let message = channelSet.message[j];
      for (var i = 0 ; i < items.length ; i++) {
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

    target.content.remove();
    target.content = chatContent;
    target.startBtn = contentBottomBtn;
    target.userContent = userContent;
    target.appendChild(chatContent);
    this._setContent(target.topTitle, TITLE_CHAT_TITLE_NEW_CHAT);
  }

  createUserList(target) {
    var userList = this.createUl();
    target.list = userList;
    target.appendChild(userList);
  }

  createUserListItem(user) {
    var li = this.createLi();

    var userItem = this.createDiv();
    this._setClass(userItem, [className.USER_ITEM]);

    var userSelect = this.createDiv();
    this._setClass(userSelect, [className.USER_SELECT]);
    this._setDataset(userSelect, 'userId', user.userId);
    li.select = userSelect;
    userItem.appendChild(userSelect);

    var userProfile = this.createDiv();
    this._setClass(userProfile, [className.IMAGE]);
    this._setBackgroundImage(userProfile, user.profileUrl);
    userItem.appendChild(userProfile);

    var userNickname = this.createDiv();
    this._setClass(userNickname, [className.NICKNAME]);
    this._setContent(userNickname, user.nickname);
    userItem.appendChild(userNickname);

    li.appendChild(userItem);
    return li;
  }

  getSelectedUserIds(target) {
    let items = target.querySelectorAll('.' + className.ACTIVE);
    var userIds = [];
    for (var i = 0 ; i < items.length ; i++) {
      let item = items[i];
      userIds.push(item.dataset.userId);
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
