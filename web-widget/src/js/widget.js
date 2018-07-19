import WidgetBtn from './elements/widget-btn.js';
import ListBoard from './elements/list-board.js';
import ChatSection from './elements/chat-section.js';
import Popup from './elements/popup.js';
import Spinner from './elements/spinner.js';
import Sendbird from './sendbird.js';
import {
  hide,
  show,
  addClass,
  removeClass,
  hasClass,
  getFullHeight,
  insertMessageInList,
  getLastItem,
  isEmptyString,
  xssEscape,
  createNotificationSound,
  requestNotification,
  setCookie,
  getCookie,
  deleteCookie
} from './utils.js';
import { className, TYPE_STRING, MAX_COUNT } from './consts.js';

const WIDGET_ID = 'sb_widget';
const TIME_STRING_TODAY = 'TODAY';
const TIME_MESSAGE_TYPE = 'time';
const NEW_CHAT_BOARD_ID = 'NEW_CHAT';
const KEY_DOWN_ENTER = 13;
const KEY_DOWN_KR = 229;
const CHAT_BOARD_WIDTH = 300;
const ERROR_MESSAGE = 'Please create "sb_widget" element on first.';
const ERROR_MESSAGE_SDK = 'Please import "SendBird SDK" on first.';
const EVENT_TYPE_CLICK = 'click';

window.WebFontConfig = {
  google: { families: ['Lato:400,700'] }
};

class SBWidget {
  constructor() {}

  start(appId) {
    if (!window.SendBird) {
      console.error(ERROR_MESSAGE_SDK);
      return;
    }
    this._getGoogleFont();
    this.widget = document.getElementById(WIDGET_ID);
    if (this.widget) {
      document.addEventListener(EVENT_TYPE_CLICK, event => {
        this._initClickEvent(event);
      });
      this._init();
      this._start(appId);
    } else {
      console.error(ERROR_MESSAGE);
    }
  }

  startWithConnect(appId, userId, nickname, callback) {
    if (!window.SendBird) {
      console.error(ERROR_MESSAGE_SDK);
      return;
    }
    this._getGoogleFont();
    this.widget = document.getElementById(WIDGET_ID);
    if (this.widget) {
      document.addEventListener(EVENT_TYPE_CLICK, event => {
        this._initClickEvent(event);
      });
      this._init();
      this._start(appId);
      this._connect(userId, nickname, callback);
    } else {
      console.error(ERROR_MESSAGE);
    }
  }

  _initClickEvent(event) {
    var _checkPopup = function(_target, obj) {
      if (obj === _target || hasClass(_target, className.IC_MEMBERS) || hasClass(_target, className.IC_INVITE)) {
        return true;
      } else {
        var returnedCheck = false;
        for (var i = 0; i < obj.childNodes.length; i++) {
          returnedCheck = _checkPopup(_target, obj.childNodes[i]);
          if (returnedCheck) break;
        }
        return returnedCheck;
      }
    };

    if (!_checkPopup(event.target, this.popup.memberPopup)) {
      this.closeMemberPopup();
    }
    if (!_checkPopup(event.target, this.popup.invitePopup)) {
      this.closeInvitePopup();
    }
  }

  _init() {
    this.spinner = new Spinner();

    this.widgetBtn = new WidgetBtn(this.widget);
    this.listBoard = new ListBoard(this.widget);
    this.chatSection = new ChatSection(this.widget);
    this.popup = new Popup();

    this.activeChannelSetList = [];
    this.extraChannelSetList = [];

    this.timeMessage = class TimeMessage {
      constructor(date) {
        this.time = date;
        this.type = TIME_MESSAGE_TYPE;
      }
      isTimeMessage() {
        return this.type == TIME_MESSAGE_TYPE;
      }
    };

    requestNotification();
    this.notificationSound = createNotificationSound();
  }

  _getGoogleFont() {
    var wf = document.createElement('script');
    wf.src =
      ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  }

  reset() {
    this.extraChannelSetList = [];
    for (var i = 0; i < this.activeChannelSetList.length; i++) {
      let channelSet = this.activeChannelSetList[i];
      let targetBoard = this.chatSection.getChatBoard(channelSet.channel.url);
      if (targetBoard) {
        this.chatSection.closeChatBoard(targetBoard);
      }
    }
    this.activeChannelSetList = [];
    this.closePopup();

    this.sb.reset();
    this.listBoard.reset();
    this.widgetBtn.reset();
  }

  responsiveChatSection(channelUrl, isShow) {
    let _bodyWidth = document.getElementsByTagName('BODY')[0].offsetWidth - 360;
    let maxSize = parseInt(_bodyWidth / CHAT_BOARD_WIDTH);
    let currentSize = this.activeChannelSetList.length;
    if (currentSize >= maxSize) {
      let extraChannelSet = getLastItem(this.activeChannelSetList);
      if (extraChannelSet) {
        if (this.extraChannelSetList.indexOf(extraChannelSet.channel.url) < 0) {
          this.extraChannelSetList.push(extraChannelSet.channel.url);
        }
        let chatBoard = this.chatSection.getChatBoard(extraChannelSet.channel.url);
        if (chatBoard) {
          this.chatSection.closeChatBoard(chatBoard);
        }
        this.removeChannelSet(extraChannelSet.channel);
      }
      if (channelUrl) {
        let idx = this.extraChannelSetList.indexOf(channelUrl);
        if (idx > -1) {
          this.extraChannelSetList.splice(idx, 1);
        }
      }
      this.chatSection.setWidth(maxSize * CHAT_BOARD_WIDTH);
    } else {
      let popChannelUrl = this.extraChannelSetList.pop();
      if (popChannelUrl) {
        this._connectChannel(popChannelUrl, true);
        this.chatSection.setWidth((currentSize + 1) * CHAT_BOARD_WIDTH);
      } else {
        if (isShow) {
          currentSize += 1;
        }
        this.chatSection.setWidth(currentSize * CHAT_BOARD_WIDTH);
      }
    }
  }

  _start(appId) {
    this.sb = new Sendbird(appId);

    this.popup.addCloseBtnClickEvent(() => {
      this.closePopup();
    });

    this.widgetBtn.addClickEvent(() => {
      this.sb.isConnected() ? this.listBoard.showChannelList() : this.listBoard.showLoginForm();
      this.toggleBoard(true);
      this.listBoard.addChannelListScrollEvent(() => {
        this.getChannelList();
      });
      this.chatSection.responsiveSize(false, this.responsiveChatSection.bind(this));
    });

    this.listBoard.addNewChatClickEvent(() => {
      this.listBoard.hideLogoutBtn();

      var chatBoard = this.chatSection.createChatBoard(NEW_CHAT_BOARD_ID);
      this.responsiveChatSection(null, true);

      this.chatSection.createNewChatBoard(chatBoard);
      this.chatSection.addClickEvent(chatBoard.startBtn, () => {
        if (!hasClass(chatBoard.startBtn, className.DISABLED)) {
          addClass(chatBoard.startBtn, className.DISABLED);
          this.sb.userListQuery = null;
          this.spinner.insert(chatBoard.startBtn);
          let selectedUserIds = this.chatSection.getSelectedUserIds(chatBoard.userContent);
          this.sb.createNewChannel(selectedUserIds, channel => {
            chatBoard.parentNode.removeChild(chatBoard);
            this._connectChannel(channel.url, true);
            this.listBoard.checkEmptyList();
          });
        }
      });
      this.spinner.insert(chatBoard.userContent);

      this.sb.getUserList(userList => {
        this.spinner.remove(chatBoard.userContent);
        this.setUserList(chatBoard, userList);
      });

      this.chatSection.addClickEvent(chatBoard.closeBtn, () => {
        this.chatSection.closeChatBoard(chatBoard);
        this.closePopup();
        this.responsiveChatSection();
      });
      hide(chatBoard.leaveBtn);
      hide(chatBoard.memberBtn);
      hide(chatBoard.inviteBtn);
    });

    this.listBoard.addMinimizeClickEvent(() => {
      this.listBoard.hideLogoutBtn();
      this.closePopup();
      this.toggleBoard(false);
      this.chatSection.responsiveSize(true, this.responsiveChatSection.bind(this));
    });

    this.listBoard.addLogoutClickEvent(() => {
      this.sb.disconnect(() => {
        deleteCookie();
        this.sb.reset();
        this.toggleBoard(false);
        this.widgetBtn.toggleIcon(false);
        this.listBoard.setOptionEventLock(false);
        this.chatSection.reset();
        this.reset();
      });
    });

    this.listBoard.addLoginClickEvent(() => {
      if (!hasClass(this.listBoard.btnLogin, className.DISABLED)) {
        this.spinner.insert(this.listBoard.btnLogin);
        this.listBoard.enabledToggle(this.listBoard.btnLogin, false);
        this.listBoard.userId.disabled = true;
        this.listBoard.nickname.disabled = true;

        this._connect(this.listBoard.getUserId(), this.listBoard.getNickname());
        setCookie(this.listBoard.getUserId(), this.listBoard.getNickname());
      }
    });
    this.listBoard.addKeyDownEvent(this.listBoard.nickname, event => {
      if (event.keyCode == KEY_DOWN_ENTER) {
        this.listBoard.btnLogin.click();
      }
    });

    const cookie = getCookie();
    if (cookie.userId) {
      this._connect(cookie.userId, cookie.nickname);
      this.listBoard.showChannelList();
      this.toggleBoard(true);
      this.chatSection.responsiveSize(false, this.responsiveChatSection.bind(this));
    }
  }

  _connect(userId, nickname, callback) {
    this.sb.connect(userId, nickname, () => {
      this.widgetBtn.toggleIcon(true);

      this.listBoard.showChannelList();
      this.spinner.insert(this.listBoard.list);
      this.getChannelList();

      this.sb.createHandlerGlobal(
        (channel, message) => {
          this.messageReceivedAction(channel, message);
        },
        (channel, message) => {
          this.messageUpdatedAction(channel, message);
        },
        (channel, messageId) => {
          this.messageDeletedAction(channel, messageId);
        },
        channel => {
          this.updateUnreadMessageCount(channel);
        },
        channel => {
          let targetBoard = this.chatSection.getChatBoard(channel.url);
          if (targetBoard) {
            let isBottom = this.chatSection.isBottom(targetBoard.messageContent, targetBoard.list);
            this.chatSection.showTyping(channel, this.spinner);
            this.chatSection.responsiveHeight(channel.url);
            if (isBottom) {
              this.chatSection.scrollToBottom(targetBoard.messageContent);
            }
          }
        },
        channel => {
          let targetBoard = this.chatSection.getChatBoard(channel.url);
          if (targetBoard) {
            var channelSet = this.getChannelSet(channel.url);
            if (channelSet) {
              this.chatSection.updateReadReceipt(channelSet, targetBoard);
            }
          }
        },
        (channel, user) => {
          if (this.sb.isCurrentUser(user)) {
            let item = this.listBoard.getChannelItem(channel.url);
            this.listBoard.list.removeChild(item);
            this.listBoard.checkEmptyList();
          } else {
            this.listBoard.setChannelTitle(channel.url, this.sb.getNicknamesString(channel));
            this.updateUnreadMessageCount(channel);
            let targetChatBoard = this.chatSection.getChatBoard(channel.url);
            if (targetChatBoard) {
              this.updateChannelInfo(targetChatBoard, channel);
            }
          }
        },
        (channel, user) => {
          this.listBoard.setChannelTitle(channel.url, this.sb.getNicknamesString(channel));
          let targetChatBoard = this.chatSection.getChatBoard(channel.url);
          if (targetChatBoard) {
            this.updateChannelInfo(targetChatBoard, channel);
          }
        }
      );

      if (callback) callback();
    });
  }

  messageReceivedAction(channel, message) {
    let target = this.listBoard.getChannelItem(channel.url);
    if (!target) {
      target = this.createChannelItem(channel);
      this.listBoard.checkEmptyList();
    }
    this.listBoard.addListOnFirstIndex(target);

    this.listBoard.setChannelLastMessage(
      channel.url,
      message.isFileMessage() ? xssEscape(message.name) : xssEscape(message.message)
    );
    this.listBoard.setChannelLastMessageTime(channel.url, this.sb.getMessageTime(message));

    let targetBoard = this.chatSection.getChatBoard(channel.url);
    if (targetBoard) {
      let isBottom = this.chatSection.isBottom(targetBoard.messageContent, targetBoard.list);
      let channelSet = this.getChannelSet(channel.url);
      let lastMessage = getLastItem(channelSet.message);
      channelSet.message.push(message);
      this.setMessageItem(channelSet.channel, targetBoard, [message], false, isBottom, lastMessage);
      channel.markAsRead();
      this.updateUnreadMessageCount(channel);
    }
    if (!targetBoard) {
      if ('Notification' in window) {
        var notification = new Notification('New Message', {
          body: message.isFileMessage() ? message.name : message.message,
          icon: 'http://qnimate.com/wp-content/uploads/2014/07/web-notification-api-300x150.jpg'
        });
        notification.onclick = function() {
          window.focus();
        };
        this.notificationSound.play();
      }
    }
  }

  messageUpdatedAction(channel, message) {
    let targetBoard = this.chatSection.getChatBoard(channel.url);
    if (targetBoard) {
      let channelSet = this.getChannelSet(channel.url);
      let newMessages = channelSet.message.map(msg => {
        if (msg.messageId === message.messageId) {
          return message;
        } else {
          return msg;
        }
      });
      channelSet.message = newMessages;

      let lastMessage = getLastItem(channelSet.message);
      if (lastMessage.messageId === message.messageId) {
        let target = this.listBoard.getChannelItem(channel.url);
        if (!target) {
          target = this.createChannelItem(channel);
          this.listBoard.checkEmptyList();
        }
        this.listBoard.addListOnFirstIndex(target);
        this.listBoard.setChannelLastMessage(
          channel.url,
          message.isFileMessage() ? xssEscape(message.name) : xssEscape(message.message)
        );
      }
      let updatedMessage = document.getElementById(`${message.messageId}`).querySelector('div>div>div.text');
      if (updatedMessage) {
        updatedMessage.innerHTML = message.message;
      }
    }
  }

  messageDeletedAction(channel, messageId) {
    let targetBoard = this.chatSection.getChatBoard(channel.url);
    if (targetBoard) {
      let channelSet = this.getChannelSet(channel.url);
      let lastMessage = getLastItem(channelSet.message);
      if (lastMessage.messageId.toString() === messageId.toString()) {
        channelSet.message.pop();
        lastMessage = getLastItem(channelSet.message);
        let target = this.listBoard.getChannelItem(channel.url);
        if (!target) {
          target = this.createChannelItem(channel);
          this.listBoard.checkEmptyList();
        }
        this.listBoard.addListOnFirstIndex(target);
        this.listBoard.setChannelLastMessage(
          channel.url,
          lastMessage.isFileMessage() ? xssEscape(lastMessage.name) : xssEscape(lastMessage.message)
        );
      } else {
        let newMessages = channelSet.message.filter(msg => {
          return msg.messageId.toString() !== messageId.toString();
        });
        channelSet.message = newMessages;
      }

      let updatedMessage = document.getElementById(`${messageId}`);
      updatedMessage.remove();
    }
  }

  setUserList(target, userList) {
    let userContent = target.userContent;
    this.chatSection.createUserList(userContent);
    for (var i = 0; i < userList.length; i++) {
      let user = userList[i];
      if (!this.sb.isCurrentUser(user)) {
        let item = this.chatSection.createUserListItem(user);
        this.chatSection.addClickEvent(item, () => {
          hasClass(item.select, className.ACTIVE)
            ? removeClass(item.select, className.ACTIVE)
            : addClass(item.select, className.ACTIVE);
          let selectedUserCount = this.chatSection.getSelectedUserIds(userContent.list).length;
          this.chatSection.updateChatTop(
            target,
            selectedUserCount > 9 ? MAX_COUNT : selectedUserCount.toString(),
            null
          );
          selectedUserCount > 0
            ? removeClass(target.startBtn, className.DISABLED)
            : addClass(target.startBtn, className.DISABLED);
        });
        userContent.list.appendChild(item);
      }
    }
    this.chatSection.addUserListScrollEvent(target, () => {
      this.sb.getUserList(userList => {
        this.setUserList(target, userList);
      });
    });
  }

  getChannelList() {
    let _list = this.listBoard.list;
    let _spinner = this.spinner;
    this.sb.getChannelList(channelList => {
      if (_list.lastElementChild == _spinner.self) {
        _spinner.remove(_list);
      }
      channelList.forEach(channel => {
        let item = this.createChannelItem(channel);
        _list.appendChild(item);
      });
      this.updateUnreadMessageCount();
      this.listBoard.checkEmptyList();
    });
  }

  createChannelItem(channel) {
    let item = this.listBoard.createChannelItem(
      channel.url,
      channel.coverUrl,
      this.sb.getNicknamesString(channel),
      this.sb.getMessageTime(channel.lastMessage),
      this.sb.getLastMessage(channel),
      this.sb.getChannelUnreadCount(channel)
    );
    this.listBoard.addChannelClickEvent(item, () => {
      this.closePopup();
      let channelUrl = item.getAttribute('data-channel-url');
      let openChatBoard = this.chatSection.getChatBoard(channelUrl);
      if (!openChatBoard) {
        var newChat = this.chatSection.getChatBoard(NEW_CHAT_BOARD_ID);
        if (newChat) {
          this.chatSection.closeChatBoard(newChat);
        }
        this._connectChannel(channelUrl);
      }
    });
    return item;
  }

  closePopup() {
    this.closeMemberPopup();
    this.closeInvitePopup();
  }

  closeMemberPopup() {
    this.chatSection.removeMemberPopup();
    this.popup.closeMemberPopup();
  }

  closeInvitePopup() {
    this.chatSection.removeInvitePopup();
    this.popup.closeInvitePopup();

    var chatBoard = this.chatSection.getChatBoard(NEW_CHAT_BOARD_ID);
    if (!chatBoard) {
      this.sb.userListQuery = null;
    }
  }

  showChannel(channelUrl) {
    this._connectChannel(channelUrl, false);
  }

  _connectChannel(channelUrl, doNotCall) {
    var chatBoard = this.chatSection.createChatBoard(channelUrl, doNotCall);
    if (!doNotCall) {
      this.responsiveChatSection(channelUrl, true);
    }
    this.chatSection.addClickEvent(chatBoard.closeBtn, () => {
      this.chatSection.closeChatBoard(chatBoard);
      this.closePopup();
      this.removeChannelSet(channelUrl);
      this.responsiveChatSection();
    });
    this.chatSection.addClickEvent(chatBoard.leaveBtn, () => {
      this.chatSection.addLeavePopup(chatBoard);
      this.chatSection.setLeaveBtnClickEvent(chatBoard.leavePopup.leaveBtn, () => {
        this.spinner.insert(chatBoard.leavePopup.leaveBtn);
        addClass(chatBoard.leavePopup.leaveBtn, className.DISABLED);
        let channelSet = this.getChannelSet(channelUrl);
        if (channelSet) {
          this.sb.channelLeave(channelSet.channel, () => {
            chatBoard.removeChild(chatBoard.leavePopup);
            removeClass(chatBoard.leavePopup.leaveBtn, className.DISABLED);
            chatBoard.leavePopup = null;
            chatBoard.closeBtn.click();
          });
        } else {
          this.chatSection.closeChatBoard(chatBoard);
        }
      });
    });
    this.chatSection.addClickEvent(chatBoard.memberBtn, () => {
      if (hasClass(chatBoard.memberBtn, className.ACTIVE)) {
        this.closeMemberPopup();
      } else {
        this.closeMemberPopup();
        this.closeInvitePopup();
        addClass(chatBoard.memberBtn, className.ACTIVE);
        let index = this.chatSection.indexOfChatBord(channelUrl);
        this.popup.showMemberPopup(this.chatSection.self, index);
        let channelSet = this.getChannelSet(channelUrl);
        this.popup.updateCount(this.popup.memberPopup.count, channelSet.channel.memberCount);
        for (var i = 0; i < channelSet.channel.members.length; i++) {
          let member = channelSet.channel.members[i];
          let item = this.popup.createMemberItem(member, false, this.sb.isCurrentUser(member));
          this.popup.memberPopup.list.appendChild(item);
        }
      }
    });
    this.chatSection.addClickEvent(chatBoard.inviteBtn, () => {
      var _getUserList = (memberIds, loadmore) => {
        this.sb.getUserList(userList => {
          if (!loadmore) {
            this.spinner.remove(this.popup.invitePopup.list);
          }
          for (var i = 0; i < userList.length; i++) {
            let user = userList[i];
            if (memberIds.indexOf(user.userId) < 0) {
              let item = this.popup.createMemberItem(user, true);
              this.popup.addClickEvent(item, () => {
                hasClass(item.select, className.ACTIVE)
                  ? removeClass(item.select, className.ACTIVE)
                  : addClass(item.select, className.ACTIVE);
                let selectedUserCount = this.popup.getSelectedUserIds(this.popup.invitePopup.list).length;
                this.popup.updateCount(this.popup.invitePopup.count, selectedUserCount);
                selectedUserCount > 0
                  ? removeClass(this.popup.invitePopup.inviteBtn, className.DISABLED)
                  : addClass(this.popup.invitePopup.inviteBtn, className.DISABLED);
              });
              this.popup.invitePopup.list.appendChild(item);
            }
          }
        });
      };

      if (hasClass(chatBoard.inviteBtn, className.ACTIVE)) {
        this.closeInvitePopup();
      } else {
        this.closeInvitePopup();
        this.closeMemberPopup();
        addClass(chatBoard.inviteBtn, className.ACTIVE);
        let index = this.chatSection.indexOfChatBord(channelUrl);
        this.popup.showInvitePopup(this.chatSection.self, index);
        this.spinner.insert(this.popup.invitePopup.list);
        let channelSet = this.getChannelSet(channelUrl);
        let memberIds = channelSet.channel.members.map(member => {
          return member.userId;
        });
        _getUserList(memberIds);

        this.popup.addClickEvent(this.popup.invitePopup.inviteBtn, () => {
          if (!hasClass(this.popup.invitePopup.inviteBtn, className.DISABLED)) {
            addClass(this.popup.invitePopup.inviteBtn, className.DISABLED);
            this.spinner.insert(this.popup.invitePopup.inviteBtn);
            let selectedUserIds = this.popup.getSelectedUserIds(this.popup.invitePopup.list);
            let channelSet = this.getChannelSet(channelUrl);
            this.sb.inviteMember(channelSet.channel, selectedUserIds, () => {
              this.spinner.remove(this.popup.invitePopup.inviteBtn);
              this.closeInvitePopup();
              this.listBoard.setChannelTitle(channelSet.channel.url, this.sb.getNicknamesString(channelSet.channel));
              this.updateChannelInfo(chatBoard, channelSet.channel);
            });
          }
        });

        this.popup.addScrollEvent(() => {
          _getUserList(memberIds, true);
        });
      }
    });
    this.spinner.insert(chatBoard.content);
    this.sb.getChannelInfo(channelUrl, channel => {
      this.updateChannelInfo(chatBoard, channel);
      let channelSet = this.getChannelSet(channel);
      this.getMessageList(channelSet, chatBoard, false, () => {
        this.chatScrollEvent(chatBoard, channelSet);
      });
      channel.markAsRead();
      this.updateUnreadMessageCount(channel);

      let listItem = this.listBoard.getChannelItem(channelUrl);
      if (!listItem) {
        listItem = this.createChannelItem(channel);
        this.listBoard.list.insertBefore(listItem, this.listBoard.list.firstChild);
      }
    });
  }

  updateChannelInfo(target, channel) {
    this.chatSection.updateChatTop(target, this.sb.getMemberCount(channel), this.sb.getNicknamesString(channel));
  }

  updateUnreadMessageCount(channel) {
    this.sb.getTotalUnreadCount(unreadCount => {
      this.widgetBtn.setUnreadCount(unreadCount);
    });

    if (channel) {
      this.listBoard.setChannelUnread(channel.url, channel.unreadMessageCount);
    }
  }

  getMessageList(channelSet, target, loadmore, scrollEvent) {
    this.sb.getMessageList(channelSet, messageList => {
      let messageItems = messageList.slice();
      let tempTime;
      for (var index = 0; index < messageList.length; index++) {
        let message = messageList[index];
        loadmore ? channelSet.message.unshift(message) : channelSet.message.push(message);

        let time = this.sb.getMessageTime(message);
        if (time.indexOf(':') > -1) {
          time = TIME_STRING_TODAY;
        }
        if (tempTime != time) {
          tempTime = time;
          insertMessageInList(messageItems, messageItems.indexOf(message), new this.timeMessage(time));
        }
      }

      let scrollToBottom = false;
      if (!loadmore) {
        if (tempTime != TIME_STRING_TODAY) {
          messageItems.push(new this.timeMessage(TIME_STRING_TODAY));
        }
        scrollToBottom = true;
        this.spinner.remove(target.content);
        this.chatSection.createMessageContent(target);
        this.chatSection.addFileSelectEvent(target.file, () => {
          let file = target.file.files[0];
          this.sb.sendFileMessage(channelSet.channel, file, message => {
            this.messageReceivedAction(channelSet.channel, message);
          });
        });
        this.chatSection.addKeyDownEvent(target.input, event => {
          if (event.keyCode == KEY_DOWN_KR) {
            this.chatSection.textKr = target.input.textContent;
          }

          if (event.keyCode == KEY_DOWN_ENTER && !event.shiftKey) {
            let textMessage = target.input.textContent || this.chatSection.textKr;
            if (!isEmptyString(textMessage.trim())) {
              this.sb.sendTextMessage(channelSet.channel, textMessage, message => {
                this.messageReceivedAction(channelSet.channel, message);
              });
            }
            this.chatSection.clearInputText(target.input, channelSet.channel.url);
            this.chatSection.textKr = '';
            channelSet.channel.endTyping();
          } else {
            channelSet.channel.startTyping();
          }
          this.chatSection.responsiveHeight(channelSet.channel.url);
        });
        this.chatSection.addKeyUpEvent(target.input, event => {
          let isBottom = this.chatSection.isBottom(target.messageContent, target.list);
          this.chatSection.responsiveHeight(channelSet.channel.url);
          if (event.keyCode == KEY_DOWN_ENTER && !event.shiftKey) {
            this.chatSection.clearInputText(target.input, channelSet.channel.url);
            if (isBottom) {
              this.chatSection.scrollToBottom(target.messageContent);
            }
          } else {
            let textMessage = target.input.textContent || this.chatSection.textKr;
            if (textMessage.length === 0) {
              channelSet.channel.endTyping();
            }
          }
        });
        this.chatSection.addPasteEvent(target.input, event => {
          var clipboardData;
          var pastedData;

          event.stopPropagation();
          event.preventDefault();

          clipboardData = event.clipboardData || window.clipboardData;
          pastedData = clipboardData.getData('Text');

          target.input.textContent += pastedData;
        });
      }
      if (scrollEvent) {
        scrollEvent();
      }
      this.setMessageItem(channelSet.channel, target, messageItems, loadmore, scrollToBottom);
    });
  }

  setMessageItem(channel, target, messageList, loadmore, scrollToBottom, lastMessage) {
    let firstChild = target.list.firstChild;
    let addScrollHeight = 0;
    let prevMessage;
    let newMessage;
    if (lastMessage && messageList[0] && !messageList[0].isTimeMessage) {
      prevMessage = lastMessage;
    }
    for (var i = 0; i < messageList.length; i++) {
      let message = messageList[i];
      if (message.isTimeMessage && message.isTimeMessage()) {
        newMessage = this.chatSection.createMessageItemTime(message.time);
        prevMessage = null;
      } else {
        let isContinue = false;
        if (message.isAdminMessage()) {
          newMessage = this.chatSection.createAdminMessageItem(message);
        } else {
          // isUserMessage() || isFileMessage()
          isContinue = prevMessage && prevMessage.sender ? message.sender.userId == prevMessage.sender.userId : false;
          let isCurrentUser = this.sb.isCurrentUser(message.sender);
          let unreadCount = channel.getReadReceipt(message);
          if (message.isUserMessage()) {
            newMessage = this.chatSection.createMessageItem(message, isCurrentUser, isContinue, unreadCount);
          } else if (message.isFileMessage()) {
            newMessage = this.chatSection.createMessageItem(message, isCurrentUser, isContinue, unreadCount);
          }
        }
        prevMessage = message;
      }

      if (loadmore) {
        target.list.insertBefore(newMessage, firstChild);
        addScrollHeight += getFullHeight(newMessage);
      } else {
        target.list.appendChild(newMessage);
      }
    }

    if (loadmore) {
      target.messageContent.scrollTop = addScrollHeight;
    } else if (scrollToBottom) {
      this.chatSection.scrollToBottom(target.messageContent);
    }
  }

  chatScrollEvent(target, channelSet) {
    this.chatSection.addScrollEvent(target.messageContent, () => {
      if (target.messageContent.scrollTop == 0) {
        this.getMessageList(channelSet, target, true);
      }
    });
  }

  getChannelSet(channel, isLast) {
    let isObject = true;
    if (typeof channel === TYPE_STRING || channel instanceof String) {
      isObject = false;
    }

    let channelSet = this.activeChannelSetList.filter(obj => {
      return isObject ? obj.channel == channel : obj.channel.url == channel;
    })[0];

    if (!channelSet && isObject) {
      channelSet = {
        channel: channel,
        query: channel.createPreviousMessageListQuery(),
        message: []
      };
      isLast ? this.activeChannelSetList.push(channelSet) : this.activeChannelSetList.unshift(channelSet);
    }

    return channelSet;
  }

  removeChannelSet(channel) {
    let isObject = true;
    if (typeof channel === TYPE_STRING || channel instanceof String) {
      isObject = false;
    }

    this.activeChannelSetList = this.activeChannelSetList.filter(function(obj) {
      return isObject ? obj.channel != channel : obj.channel.url != channel;
    });
  }

  toggleBoard(isShow) {
    if (isShow) {
      hide(addClass(removeClass(this.widgetBtn.self, className.FADE_IN), className.FADE_OUT));
      show(addClass(removeClass(this.listBoard.self, className.FADE_OUT), className.FADE_IN));
    } else {
      hide(addClass(removeClass(this.listBoard.self, className.FADE_IN), className.FADE_OUT));
      show(addClass(removeClass(this.widgetBtn.self, className.FADE_OUT), className.FADE_IN));
    }
  }
}

window.sbWidget = new SBWidget();
