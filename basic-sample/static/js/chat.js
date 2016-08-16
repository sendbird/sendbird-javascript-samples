
var appId = 'A7A2672C-AD11-11E4-8DAA-0A18B21C2D82';
var currScrollHeight = 0;
var MESSAGE_TEXT_HEIGHT = 27;

var nickname = null;
var userId = null;
var channelListPage = 0;
var currChannelUrl = null;
var currChannelInfo = null;
var leaveChannelUrl = '';
var leaveMessagingChannelUrl = '';
var userListToken = '';
var userListNext = 0;
var targetAddMessagingChannel = null;

var isOpenChat = false;
var memberList = [];
var isTyping = false;
var typingUser = [];

var TYPE_CHECK_TIME = 10000;

// 3.0.0
var currentUser;

$('#guide_create').click(function() {
  $('.modal-guide-create').hide();
});

/***********************************************
 *                OPEN CHAT
 **********************************************/
$('#btn_open_chat').click(function() {
  popupInit();
  $('.modal-guide-create').hide();
  $('.left-nav-button-guide').hide();
  $('.modal-messaging').hide();
  $('#btn_messaging_chat').removeClass('left-nav-messaging--active');

  if ($(this).hasClass('left-nav-open--active')) {
    $('.right-section__modal-bg').hide();
    $(this).removeClass('left-nav-open--active');
    $('.modal-open-chat').hide();
  } else {
    $('.right-section__modal-bg').show();
    $(this).addClass('left-nav-open--active');
    getChannelList(true);
  }
});

$('.modal-open-chat-more').click(function() {
  getChannelList(false);
});

function getChannelList(isFirstPage) {
  if(isFirstPage) {
    $('.modal-open-chat-list').html('');
    OpenChannelListQuery = sb.OpenChannel.createOpenChannelListQuery();
  }

  if (OpenChannelListQuery.hasNext) {
    OpenChannelListQuery.next(function(channels, error){
      if (error) {
        return;
      }

      $('.modal-open-chat-list').append(createChannelList(channels));
      channelListPage = channels['page'];
      if (channels['next'] != 0) {
        $('.modal-open-chat-more').show();
      } else {
        $('.modal-open-chat-more').hide();
      }
      $('.modal-open-chat').show();
    });
  }
}

function createChannelList(channels) {
  var channelListHtml = '';

  for (var i in channels) {
    var channel = channels[i];
      channelListHtml += '' +
        '<div class="modal-open-chat-list__item" onclick="joinChannel(\''+ channel.url +'\')">' +
        channel.name + '</div>';
  }
  return channelListHtml;
}

function joinChannel(channelUrl) {
  if (channelUrl == currChannelUrl) {
    navInit();
    popupInit();
    return false;
  }

  PreviousMessageListQuery = null;
  sb.OpenChannel.getChannel(channelUrl, function(channel, error){
    if (error) {
      return;
    }

    channel.enter(function(response, error){
      if (error) {
        if (error.code == 900100) {
          alert('Oops...You got banned out from this channel.');
        }
        return;
      }

      currChannelInfo = channel;
      currChannelUrl = channelUrl;

      $('.chat-empty').hide();
      initChatTitle(currChannelInfo.name, 0);

      $('.chat-canvas').html('');
      $('.chat-input-text__field').val('');
      $('.chat').show();

      navInit();
      popupInit();

      isOpenChat = true;
      loadMoreChatMessage(scrollPositionBottom);
      setWelcomeMessage(currChannelInfo.name);
      addChannel();
      $('.chat-input-text__field').attr('disabled', false);

    });
  });
}

function addChannel() {
  if ($('.left-nav-channel-open').length == 0) {
    $('.left-nav-channel-empty').hide();
  }

  $.each($('.left-nav-channel'), function(index, channel) {
    $(channel).removeClass('left-nav-channel-open--active');
    $(channel).removeClass('left-nav-channel-messaging--active');
    $(channel).removeClass('left-nav-channel-group--active');
  });

  var addFlag = true;
  $.each($('.left-nav-channel-open'), function(index, channel) {
    if (currChannelUrl == $(channel).data('channel-url')) {
      $(channel).addClass('left-nav-channel-open--active');
      addFlag = false;
    }
  });

  if(addFlag) {
    $('#open_channel_list').append(
      '<div class="left-nav-channel left-nav-channel-open left-nav-channel-open--active" ' +
      '     onclick="joinChannel(\'' + currChannelInfo.url + '\')"' +
      '     data-channel-url="' + currChannelInfo.url + '"' +
      '>' +
      (currChannelInfo.name.length > 12 ? currChannelInfo.name.substring(0, 12) + '...' : currChannelInfo["name"]) +
      '</div>'
    );
  }

  $('.modal-guide-create').hide();
  $('.left-nav-button-guide').hide();
}

function leaveChannel(channel, obj) {
  popupInit();

  leaveChannelUrl = channel['channel_url'];

  if($('.chat-top__button-invite').is(':visible')) {
    $('.modal-leave-channel-desc').html('Do you want to leave this messaging channel?');
  } else {
    $('.modal-leave-channel-desc').html('Do you want to leave this channel?');
  }

  $('.modal-leave-channel').show();
  return false;
}

$('.chat-top__button-leave').click(function() {
  if($('.chat-top__button-invite').is(':visible')) {
    endMessaging(currChannelInfo, $(this))
  } else {
    leaveChannel(currChannelInfo, $(this));
  }
});

$('.chat-top__button-member').click(function() {
  if ($('.modal-member').is(":visible")) {
    $(this).removeClass('chat-top__button-member--active');
    $('.modal-member').hide();
  } else {
    popupInit();
    $(this).addClass('chat-top__button-member--active');
    getMemberList(currChannelInfo);
    $('.modal-member').show();
  }
});

$('.chat-top__button-invite').click(function() {
  if ($('.modal-invite').is(":visible")) {
    $(this).removeClass('chat-top__button-invite--active');
    $('.modal-invite').hide();
  } else {
    popupInit();
    $(this).addClass('chat-top__button-invite--active');
    getUserList();
    $('.modal-invite').show();
  }
});

function getMemberList(channel) {
  if (channel.isOpenChannel()) {
    OpenChannelParticipantListQuery = channel.createParticipantListQuery(channel);
    OpenChannelParticipantListQuery.next(function (members, error) {
      if (error) {
        return;
      }

      $('.modal-member-list').html('');
      var memberListHtml = '';
      members.forEach(function (member) {
        memberListHtml += '' +
          '<div class="modal-member-list__item">' +
          '<div class="modal-member-list__icon modal-member-list__icon--online"></div>' +
          '  <div class="modal-member-list__name">' +
          (member.nickname.length > 13 ? member.nickname.substring(0, 12) + '...' : member.nickname) +
          '  </div>' +
          '</div>';
      });
      $('.modal-member-list').html(memberListHtml);
    });
  }

  if (channel.isGroupChannel()) {
    var members = channel.members;
    $('.modal-member-list').html('');

    var memberListHtml = '';
    members.forEach(function (member) {
      if (member.connectionStatus == 'online') {
        memberListHtml += '' +
          '<div class="modal-member-list__item">' +
          '<div class="modal-member-list__icon modal-member-list__icon--online"></div>' +
          '  <div class="modal-member-list__name">' +
          (member.nickname.length > 13 ? member.nickname.substring(0, 12) + '...' : member.nickname) +
          '  </div>' +
          '</div>';
      } else { // (member.connectionStatus == 'offline')
        memberListHtml += '' +
          '<div class="modal-member-list__item">' +
          '<div class="modal-member-list__icon"></div>' +
          '  <div class="modal-member-list__name">' +
          (member.nickname.length > 13 ? member.nickname.substring(0, 12) + '...' : member.nickname) +
          '  </div>' +
          '</div>';
      }
    });
    $('.modal-member-list').html(memberListHtml);
  }
}

$('.modal-leave-channel-close').click(function() {
  $('.modal-leave-channel').hide();
  leaveChannelUrl = '';
  return false;
});

$('.modal-leave-channel-submit').click(function() {
  $('#open_channel_list').removeClass('chat-top__button-leave--active');

  if (currChannelInfo.isOpenChannel()) {
    currChannelInfo.exit(function(response, error){
      if (error) {
        return;
      }
      $('.chat-canvas').html('');
      $('.chat-input-text__field').val('');
      $('.chat').hide();
      initChatTitle('', -1);
      $('.chat-empty').show();

      $('.left-nav-channel-open--active').remove();

      if ($('.left-nav-channel-open').length == 0) {
      $('.left-nav-channel-empty').show();
      }

      $('.modal-leave-channel').hide();
      channelListPage = 0;
      currChannelUrl = null;
      currChannelInfo = null;
      leaveChannelUrl = '';

      $('.chat-input-text__field').attr('disabled', true);
    });
  } else if (currChannelInfo.isGroupChannel()) {
    currChannelInfo.leave(function(response, error){
      if (error) {
        return;
      }

      $('.chat-canvas').html('');
      $('.chat-input-text__field').val('');
      $('.chat').hide();
      initChatTitle('', -1);
      $('.chat-empty').show();

      $('.left-nav-channel-messaging--active').remove();
      $('.left-nav-channel-group--active').remove();

      $('.modal-leave-channel').hide();
      channelListPage = 0;
      currChannelUrl = null;
      currChannelInfo = null;
      leaveMessagingChannelUrl = '';

      $('.chat-input-text__field').attr('disabled', true);
    });
  }
});
/***********************************************
 *              // END OPEN CHAT
 **********************************************/


/***********************************************
 *                MESSAGING
 **********************************************/
$('#btn_messaging_chat').click(function() {
  popupInit();
  $('.modal-guide-create').hide();
  $('.left-nav-button-guide').hide();
  $('.modal-open-chat').hide();
  $('#btn_open_chat').removeClass('left-nav-open--active');

  if ($(this).hasClass('left-nav-messaging--active')) {
    $('.right-section__modal-bg').hide();
    $(this).removeClass('left-nav-messaging--active');
    $('.modal-messaging').hide();
  } else {
    $('.right-section__modal-bg').show();
    $(this).addClass('left-nav-messaging--active');
    userListToken = '';
    userListNext = 0;
    $('.modal-messaging-list').html('');
    getUserList();
    $('.modal-messaging').show();
  }
});

function getUserList(isFirstPage) {
  if (isFirstPage) {
    $('.modal-messaging-list').html('');
    UserListQuery = sb.createUserListQuery();
  }

  if (UserListQuery.hasNext) {
    UserListQuery.next(function(userList, error){
      if (error) {
        return;
      }

      var users = userList;
      $('.modal-messaging-more').remove();
      $.each(users, function(index, user) {
        UserList[user.userId] = user;
        if (!isCurrentUser(user.userId)) {
          $('.modal-messaging-list').append(
            '<div class="modal-messaging-list__item" onclick="userClick($(this))">' +
            (user.nickname.length > 12 ? user.nickname.substring(0, 12) + '...' : user.nickname) +
            '  <div class="modal-messaging-list__icon" data-guest-id="' + user.userId + '"></div>' +
            '</div>'
          );
        }
      });

      if (UserListQuery.hasNext) {
        $('.modal-messaging-list').append(
          '<div class="modal-messaging-more" onclick="userListLoadMore()">MORE<div class="modal-messaging-more__icon"></div></div>'
        );
      } else {
        $('.modal-messaging-more').remove();
      }
    });
  }

}

function userListLoadMore() {
  getUserList(false);
}

function userClick(obj) {
  var el = obj.find('div');
  if (el.hasClass('modal-messaging-list__icon--select')) {
    el.removeClass('modal-messaging-list__icon--select');
  } else {
    el.addClass('modal-messaging-list__icon--select');
  }

  var selectCount = $('.modal-messaging-list__icon--select').length;
  if (selectCount > 1) {
    $('.modal-messaging-top__title').html('Group Chat ({})'.format(selectCount));
  } else {
    $('.modal-messaging-top__title').html('Group Channel');
  }
}

function startMessaging() {
  if ($('.modal-messaging-list__icon--select').length == 0) {
    alert('Please select user');
    return false;
  }

  var users = [];
  $.each($('.modal-messaging-list__icon--select'), function(index, user) {
    users.push(UserList[$(user).data("guest-id")]);
  });

  PreviousMessageListQuery = null;
  sb.GroupChannel.createChannel(users, true, 'test_name', '', '', function(channel, error){
    if (error) {
      return;
    }

    currChannelInfo = channel;
    currChannelUrl = channel.url;

    var members = channel.members;
    var channelTitle = '';

    $.each(members, function(index, member) {
      if (!isCurrentUser(member.userId)) {
        channelTitle += member.nickname + ', ';
      }
    });

    channelTitle = channelTitle.slice(0,-2);
    var channelMemberList = channelTitle;
    if (channelTitle.length > 24) {
      channelTitle = channelTitle.substring(0, 22);
      channelTitle += '... '
    }
    var titleType = 1;
    var isGroup = true;
    if(members.length > 2) {
      channelTitle += '({})'.format(members.length);
      titleType = 2;
    }

    $('.chat-empty').hide();
    initChatTitle(channelTitle, titleType);
    $('.chat-canvas').html('');
    $('.chat-input-text__field').val('');
    $('.chat').show();

    navInit();
    popupInit();
    makeMemberList(members);

    isOpenChat = false;
    loadMoreChatMessage(scrollPositionBottom);
    setWelcomeMessage('Messaging Channel');
    addMessagingChannel(true, channelMemberList, currChannelInfo);
    $('.chat-input-text__field').attr('disabled', false);
  });

  return;

}

function addMessagingChannel(isGroup, channelMemberList, targetChannel) {
  $.each($('.left-nav-channel'), function(index, channel) {
    $(channel).removeClass('left-nav-channel-open--active');
    $(channel).removeClass('left-nav-channel-messaging--active');
    $(channel).removeClass('left-nav-channel-group--active');
  });

  var addFlag = true;
  $.each($('.left-nav-channel-messaging'), function(index, channel) {
    if (currChannelUrl == $(channel).data('channel-url')) {
      $(channel).addClass('left-nav-channel-messaging--active');
      $(channel).find('div[class="left-nav-channe__unread"]').remove();
      addFlag = false;
    }
  });
  $.each($('.left-nav-channel-group'), function(index, channel) {
    if (currChannelUrl == $(channel).data('channel-url')) {
      $(channel).addClass('left-nav-channel-group--active');
      $(channel).find('div[class="left-nav-channe__unread"]').remove();
      addFlag = false;
    }
  });

  if (channelMemberList.length > 9) {
    channelMemberList = channelMemberList.substring(0, 9) + '...';
  }

  targetAddMessagingChannel = targetChannel;
  if (addFlag && !isGroup) {
    $('#messaging_channel_list').append(
      '<div class="left-nav-channel left-nav-channel-messaging left-nav-channel-messaging--active" ' +
      '     onclick="joinMessagingChannel(\'' + targetChannel.url + '\')"' +
      '     data-channel-url="' + targetChannel.url + '"' +
      '>' +
      channelMemberList +
      '</div>'
    );
  } else if (addFlag && isGroup) {
    $('#messaging_channel_list').append(
      '<div class="left-nav-channel left-nav-channel-group left-nav-channel-group--active" ' +
      '     onclick="joinMessagingChannel(\'' + targetChannel.url + '\')"' +
      '     data-channel-url="' + targetChannel.url + '"' +
      '>' +
      channelMemberList +
      '</div>'
    );
    targetAddMessagingChannel = null;
  }

  $('.modal-guide-create').hide();
  $('.left-nav-button-guide').hide();
}

function joinMessagingChannel(channelUrl) {

  if (channelUrl == currChannelUrl) {
    navInit();
    popupInit();
    $.each($('.left-nav-channel'), function(index, channel) {
      if ($(channel).data('channel-url') == channelUrl) {
        $(channel).find('div[class="left-nav-channe__unread"]').remove();
      }
    });
    return false;
  }

  PreviousMessageListQuery = null;
  sb.GroupChannel.getChannel(channelUrl, function(channel, error){
    if (error) {
      console.error(error);
      return;
    }

    channel.markAsRead();

    currChannelInfo = channel;
    currChannelUrl = channelUrl;

    var members = channel.members;
    var channelTitle = '';

    channel.refresh(function(){
      // TODO
    });

    $.each(members, function(index, member) {
      if (!isCurrentUser(member.userId)) {
        channelTitle += member.nickname + ', ';
      }
    });

    channelTitle = channelTitle.slice(0,-2);
    var channelMemberList = channelTitle;
    if (channelTitle.length > 24) {
      channelTitle = channelTitle.substring(0, 22);
      channelTitle += '... '
    }
    var titleType = 1;
    var isGroup = false;
    if (members.length > 2) {
      channelTitle += '({})'.format(members.length);
      titleType = 2;
      isGroup = true;
    }

    $('.chat-empty').hide();
    initChatTitle(channelTitle, titleType);
    $('.chat-canvas').html('');
    $('.chat-input-text__field').val('');
    $('.chat').show();

    navInit();
    popupInit();
    makeMemberList(members);

    isOpenChat = false;
    loadMoreChatMessage(scrollPositionBottom);
    setWelcomeMessage('Messaging Channel');
    addMessagingChannel(isGroup, channelMemberList, currChannelInfo);
    $('.chat-input-text__field').attr('disabled', false);
  });

  return;

}

function endMessaging(channel, obj) {
  popupInit();
  leaveMessagingChannelUrl = channel.url;
  $('.modal-leave-channel-desc').html('Do you want to leave this messaging channel?');
  $('.modal-leave-channel').show();
  return false;
}

function inviteMember() {
  if ($('.modal-messaging-list__icon--select').length == 0) {
    alert('Please select user');
    return false;
  }

  var userIds = [];
  $.each($('.modal-messaging-list__icon--select'), function(index, user) {
    if ($(user).data("guest-id")) {
      userIds.push($(user).data("guest-id"));
    }
  });

  currChannelInfo.inviteWithUserIds(userIds, function(response, error) {
    if (error) {
      return;
    }

    popupInit();
  });

}

function getMessagingChannelList() {
  GroupChannelListQuery.next(function(channels, error){
    if (error) {
      return;
    }

    channels.forEach(function(channel){
      var channelMemberList = '';
      var members = channel.members;

      members.forEach(function(member){
        if (currentUser.userId != member.userId) {
          channelMemberList += member.nickname + ', ';
        }
      });

      channelMemberList = channelMemberList.slice(0, -2);
      addMessagingChannel(true, channelMemberList, channel);

      $.each($('.left-nav-channel'), function(index, item) {
        $(item).removeClass('left-nav-channel-messaging--active');
        $(item).removeClass('left-nav-channel-group--active');
      });

      var targetUrl = channel.url;
      var unread = channel.unreadMessageCount > 9 ? '9+' : channel.unreadMessageCount;
      if (unread != 0) {
        $.each($('.left-nav-channel'), function(index, item) {
          if ($(item).data("channel-url") == targetUrl) {
            addUnreadCount(item, unread, targetUrl);
          }
        });
      }
    });

  });

}

function makeMemberList(members) {
  var item = {};
  //Clear memberList before updating it
  memberList = [];
  $.each(members, function(index, member) {
    item = {};
    if (!isCurrentUser(member['user_id'])) {
      item["user_id"] = member["user_id"];
      item["name"] = member["name"];
      memberList.push(item);
    }
  });
}
/***********************************************
 *            // END MESSAGING
 **********************************************/


/***********************************************
 *            SendBird Settings
 **********************************************/
var sb;

var GroupChannelListQuery;
var OpenChannelListQuery;
var OpenChannelParticipantListQuery;

var UserListQuery;
var SendMessageHandler;

var UserList = {};
var isInit = false;

function startSendBird(userId, nickName) {
  sb = new SendBird({
    appId: appId
  });

  sb.connect(userId, function(user, error){
    if (error) {
      return;
    } else {
      initPage(user);
    }
  });

  var initPage = function(user){
    isInit = true;
    $('.init-check').hide();

    currentUser = user;
    sb.updateCurrentUserInfo(nickName, '', function(response, error) {
      // console.log(response, error);
    });

    GroupChannelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
    OpenChannelListQuery = sb.OpenChannel.createOpenChannelListQuery();
    UserListQuery = sb.createUserListQuery();

    GroupChannelListQuery.limit = 100;
    OpenChannelListQuery.limit = 100;

    UserListQuery.limit = 100;

    getMessagingChannelList();
  };

  var ConnectionHandler = new sb.ConnectionHandler();
  ConnectionHandler.onReconnectStarted = function(id) {
    
  };

  ConnectionHandler.onReconnectSucceeded = function(id) {
    if (!isInit) {
      initPage();
    }
  };

  ConnectionHandler.onReconnectFailed = function(id) {
    
  };
  sb.addConnectionHandler('uniqueID', ConnectionHandler);


  var ChannelHandler = new sb.ChannelHandler();
  ChannelHandler.onMessageReceived = function(channel, message){

    if (currChannelInfo == channel) {
      if (channel.isGroupChannel()) {
        channel.markAsRead();
      }

      if (!document.hasFocus()) {
        notifyMessage(channel, message.message);
      }
    } else {
      unreadCountUpdate(channel);
    }

    if (message.isUserMessage()) {
      setChatMessage(message);
    }

    if (message.isFileMessage()) {
      $('.chat-input-file').removeClass('file-upload');
      $('#chat_file_input').val('');

      if (message.type.match(/^image\/.+$/)) {
        setImageMessage(message);
      } else {
        setFileMessage(message);
      }
    }

    if (message.isAdminMessage()) {
      setBroadcastMessage(message);
    }
  };

  SendMessageHandler = function(message, error) {
    if (error) {
      if (error.code == 900050) {
        setSysMessage({'message': 'This channel is freeze.'});
        return;
      } else if(error.code == 900041) {
        setSysMessage({'message': 'You are muted.'});
        return;
      }
    }

    if (message.isUserMessage()) {
      setChatMessage(message);
    }

    if (message.isFileMessage()) {
      $('.chat-input-file').removeClass('file-upload');
      $('#chat_file_input').val('');

      if (message.type.match(/^image\/.+$/)) {
        setImageMessage(message);
      } else {
        setFileMessage(message);
      }
    }
  };

  ChannelHandler.onMessageDeleted = function (channel, messageId) {
    console.log('ChannelHandler.onMessageDeleted: ', channel, messageId);
  };

  ChannelHandler.onReadReceiptUpdated = function (channel) {
    console.log('ChannelHandler.onReadReceiptUpdated: ', channel);
  };

  ChannelHandler.onTypingStatusUpdated = function (channel) {
    console.log('ChannelHandler.onTypingStatusUpdated: ', channel);
  };

  ChannelHandler.onUserJoined = function (channel, user) {
    console.log('ChannelHandler.onUserJoined: ', channel, user);
  };

  ChannelHandler.onUserLeft = function (channel, user) {
    console.log('ChannelHandler.onUserLeft: ', channel, user);
    setSysMessage({'message': '"' + user.nickname + '" user is left.'});
  };

  ChannelHandler.onUserEntered = function (channel, user) {
    console.log('ChannelHandler.onUserEntered: ', channel, user);
  };

  ChannelHandler.onUserExited = function (channel, user) {
    console.log('ChannelHandler.onUserExited: ', channel, user);
  };

  ChannelHandler.onUserMuted = function (channel, user) {
    console.log('ChannelHandler.onUserMuted: ', channel, user);
  };

  ChannelHandler.onUserUnmuted = function (channel, user) {
    console.log('ChannelHandler.onUserUnmuted: ', channel, user);
  };

  ChannelHandler.onUserBanned = function (channel, user) {
    console.log('ChannelHandler.onUserBanned: ', channel, user);
    if (isCurrentUser(user.userId)) {
      alert('Oops...You got banned out from this channel.');
      navInit();
      popupInit();
    } else {
      setSysMessage({'message': '"' + user.nickname + '" user is banned.'});
    }
  };

  ChannelHandler.onUserUnbanned = function (channel, user) {
    console.log('ChannelHandler.onUserUnbanned: ', channel, user);
    setSysMessage({'message': '"' + user.nickname + '" user is unbanned.'});
  };

  ChannelHandler.onChannelFrozen = function (channel) {
    console.log('ChannelHandler.onChannelFrozen: ', channel);
  };

  ChannelHandler.onChannelUnfrozen = function (channel) {
    console.log('ChannelHandler.onChannelUnfrozen: ', channel);
  };

  ChannelHandler.onChannelChanged = function (channel) {
    console.log('ChannelHandler.onChannelChanged: ', channel);
  };

  ChannelHandler.onChannelDeleted = function (channel) {
    console.log('ChannelHandler.onChannelDeleted: ', channel);
  };

  sb.addChannelHandler('channel', ChannelHandler);
}

var checkTyping = setInterval(function() {
  var now = new Date().getTime();
  $.each(typingUser, function(index, user) {
    var typingTime = user["ts"];
    if (now - typingTime > TYPE_CHECK_TIME) {
      endTyping(user['user']['user_id']);
    }
  });
}, TYPE_CHECK_TIME);

function endTyping(userId) {
  var temp = [];
  $.each(typingUser, function(index, user) {
    if (user['user']['user_id'] != userId) {
      temp.push(user);
    }
  });
  typingUser = temp;

  if (typingUser.length == 0) {
    $('.chat-input-typing').html('');
    $('.chat-input-typing').hide();
  } else {
    var typingMember = '';
    $.each(typingUser, function(index, user) {
      typingMember += user['user']['name'] + ', ';
    });

    if (typingMember.length > 2) {
      if (typingUser.length > 2) {
        typingMember = 'someone are';
      } else if (typingUser.length == 2) {
        typingMember = '{} are'.format(typingMember.slice(0, -2));
      } else {
        typingMember = '{} is'.format(typingMember.slice(0, -2));
      }
    }

    $('.chat-input-typing').html('{} typing...'.format(typingMember));
    $('.chat-input-typing').show();
  }
}

/***********************************************
 *          // END SendBird Settings
 **********************************************/


/***********************************************
 *              Common Function
 **********************************************/
function initChatTitle(title, index) {
  $('.chat-top__title').html(title);
  $('.chat-top__title').show();
  $('.chat-top-button').show();
  $('.chat-top__button-invite').hide();
  $('.chat-top__title').removeClass('chat-top__title--messaging');
  $('.chat-top__title').removeClass('chat-top__title--group');
  if  (index == -1) {
    $('.chat-top__title').hide();
    $('.chat-top-button').hide();
  } else if (index == 0) {
    $('.chat-top__button-member').removeClass('chat-top__button-member__all');
    $('.chat-top__button-member').addClass('chat-top__button-member__right');
  } else {
    if (index == 1) {
      $('.chat-top__title').addClass('chat-top__title--messaging');
    } else {
      $('.chat-top__title').addClass('chat-top__title--group');
    }
    $('.chat-top__button-member').removeClass('chat-top__button-member__right');
    $('.chat-top__button-member').addClass('chat-top__button-member__all');
    $('.chat-top__button-invite').show();
  }
}

var scrollPositionBottom = function() {
  var scrollHeight = $('.chat-canvas')[0].scrollHeight;
  $('.chat-canvas')[0].scrollTop = scrollHeight;
  currScrollHeight = scrollHeight;
};

function afterImageLoad(obj) {
  $('.chat-canvas')[0].scrollTop = $('.chat-canvas')[0].scrollTop + obj.height + $('.chat-canvas__list').height();
}

function setChatMessage(obj) {
  $('.chat-canvas').append(messageList(obj));
  scrollPositionBottom();
}

var PreviousMessageListQuery = null;
function loadMoreChatMessage(func) {
  if (!PreviousMessageListQuery) {
    PreviousMessageListQuery = currChannelInfo.createPreviousMessageListQuery();
  }

  PreviousMessageListQuery.load(50, false, function(messages, error){
    if (error) {
      return;
    }

    var moreMessage = messages;
    var msgList = '';
    messages.forEach(function(message){
      switch (message.MESSAGE_TYPE) {
        case message.MESSAGE_TYPE_USER:
          msgList += messageList(message);
          break;
        case message.MESSAGE_TYPE_FILE:
          $('.chat-input-file').removeClass('file-upload');
          $('#chat_file_input').val('');

          if (message.type.match(/^image\/.+$/)) {
            msgList +=imageMessageList(message);
          } else {
            msgList +=fileMessageList(message);
          }
          break;
        default:
      }
    });

    $('.chat-canvas').prepend(msgList);
    $('.chat-canvas')[0].scrollTop = (moreMessage.length * MESSAGE_TEXT_HEIGHT);

    if (func) {
      func();
    }
  });
}

function messageList(obj) {
  var msgList = '';
  var message = obj;
  var user = message.sender;
  if (isCurrentUser(user.userId)) {
    msgList += '' +
      '<div class="chat-canvas__list">' +
      '  <label class="chat-canvas__list-name chat-canvas__list-name__user">' +
      nameInjectionCheck(user.nickname) +
      '  </label>' +
      '  <label class="chat-canvas__list-separator">:</label>' +
      '  <label class="chat-canvas__list-text">' +
      convertLinkMessage(message.message) +
      '  </label>' +
      '</div>';
  } else {
    msgList += '' +
      '<div class="chat-canvas__list">' +
      '  <label class="chat-canvas__list-name">' +
      nameInjectionCheck(user.nickname) +
      '  </label>' +
      '  <label class="chat-canvas__list-separator">:</label>' +
      '  <label class="chat-canvas__list-text">' +
      convertLinkMessage(message.message) +
      '  </label>' +
      '</div>';
  }
  return msgList;
}

function fileMessageList(obj) {
  var msgList = '';
  var message = obj;
  var user = message.sender;
  if (isCurrentUser(user.userId)) {
    msgList += '' +
      '<div class="chat-canvas__list">' +
      '  <label class="chat-canvas__list-name chat-canvas__list-name__user">' +
      nameInjectionCheck(user.nickname) +
      '  </label>' +
      '  <label class="chat-canvas__list-separator">:</label>' +
      '  <label class="chat-canvas__list-text">' +
      '    <label class="chat-canvas__list-text-file">FILE</label>' +
      '    <a href="' + message.url + '" target="_blank">' + message.name + '</a>' +
      '  </label>' +
      '</div>';
  } else {
    msgList += '' +
      '<div class="chat-canvas__list">' +
      '  <label class="chat-canvas__list-name">' +
      nameInjectionCheck(user.nickname) +
      '  </label>' +
      '  <label class="chat-canvas__list-separator">:</label>' +
      '  <label class="chat-canvas__list-text">' +
      '    <label class="chat-canvas__list-text-file">FILE</label>' +
      '    <a href="' + message.url + '" target="_blank">' + message.name + '</a>' +
      '  </label>' +
      '</div>';
  }
  return msgList;
}

function imageMessageList(obj) {
  var msgList = '';
  var message = obj;
  var user = message.sender;
  if (isCurrentUser(user.userId)) {
    msgList += '' +
      '<div class="chat-canvas__list">' +
      '  <label class="chat-canvas__list-name chat-canvas__list-name__user">' +
      nameInjectionCheck(user.nickanme) +
      '  </label>' +
      '  <label class="chat-canvas__list-separator">:</label>' +
      '  <label class="chat-canvas__list-text">' +
      message.name +
      '  </label>' +
      '  <div class="chat-canvas__list-file" onclick="window.open(\'' + message.url + '\', \'_blank\');">' +
      '    <img src="' + message.url + '" class="chat-canvas__list-file-img" onload="afterImageLoad(this)">' +
      '  </div>' +
      '</div>';
  } else {
    msgList += '' +
      '<div class="chat-canvas__list">' +
      '  <label class="chat-canvas__list-name">' +
      nameInjectionCheck(user.nickanme) +
      '  </label>' +
      '  <label class="chat-canvas__list-separator">:</label>' +
      '  <label class="chat-canvas__list-text">' +
      message.name +
      '  </label>' +
      '  <div class="chat-canvas__list-file" onclick="window.open(\'' + message.url + '\', \'_blank\');">' +
      '    <img src="' + message.url + '" class="chat-canvas__list-file-img" onload="afterImageLoad(this)">' +
      '  </div>' +
      '</div>';
  }
  return msgList;
}

function setWelcomeMessage(name) {
  $('.chat-canvas').append(
    '<div class="chat-canvas__list-notice">' +
    '  <label class="chat-canvas__list-system">' +
    'Welcome to {}!'.format(name) +
    '  </label>' +
    '</div>'
  );
}

$('.chat-input-text__field').keydown(function (event) {
  if (event.keyCode == 13 && !event.shiftKey) {
    event.preventDefault();
    if (!$.trim(this.value).isEmpty()) {
      event.preventDefault();
      this.value = $.trim(this.value);

      currChannelInfo.sendUserMessage($.trim(this.value), '', SendMessageHandler);

      scrollPositionBottom();
    }
    this.value = "";
  } else {
    if (!$.trim(this.value).isEmpty()) {
      if (!currChannelInfo.isOpenChannel()) {
        currChannelInfo.startTyping();
      }
    }
  }
});

$('#chat_file_input').change(function() {
  if ($('#chat_file_input').val().trim().length == 0) return;
  var file = $('#chat_file_input')[0].files[0];
  $('.chat-input-file').addClass('file-upload');

  currChannelInfo.sendFileMessage(file, SendMessageHandler);
});

function setImageMessage(obj) {
  $('.chat-canvas').append(imageMessageList(obj));
  scrollPositionBottom();
}

function setFileMessage(obj) {
  $('.chat-canvas').append(fileMessageList(obj));
  scrollPositionBottom();
}

$('.chat-canvas').on('scroll', function() {
  setTimeout(function() {
    var currHeight = $('.chat-canvas').scrollTop();
    if (currHeight == 0) {
      if ($('.chat-canvas')[0].scrollHeight > $('.chat-canvas').height()) {
        loadMoreChatMessage();
      }
    }
  }, 200);
});

function setSysMessage(obj) {
  $('.chat-canvas').append(
    '<div class="chat-canvas__list-notice">' +
    '  <label class="chat-canvas__list-system">' +
    obj['message'] +
    '  </label>' +
    '</div>'
  );
  scrollPositionBottom();
}

function setBroadcastMessage(obj) {
  $('.chat-canvas').append(
    '<div class="chat-canvas__list">' +
    '  <label class="chat-canvas__list-broadcast">' +
    obj['message'] +
    '  </label>' +
    '</div>'
  );
  scrollPositionBottom();
}

function unreadCountUpdate(channel) {
  var targetUrl = channel.url;

  var callAdd = true;
  var unread = channel.unreadMessageCount > 9 ? '9+' : channel.unreadMessageCount;
  if (unread > 0 || unread == '9+') {
    $.each($('.left-nav-channel'), function(index, item) {
      if ($(item).data("channel-url") == targetUrl) {
        addUnreadCount(item, unread, targetUrl);
        callAdd = false;
      }
    });

    if (callAdd) {
      showChannel(channel, unread, targetUrl);
    }
  } else {
    showChannel(channel, unread, targetUrl);
  }
}

function addUnreadCount(item, unread, targetUrl) {
  if (targetUrl == currChannelUrl) {
    if (document.hasFocus()) {
      return;
    }
  }

  if ($(item).find('div[class="left-nav-channe__unread"]').length != 0) {
    $(item).find('div[class="left-nav-channe__unread"]').html(unread);
  } else {
    $(item).append(
      '<div class="left-nav-channe__unread">' +
      unread +
      '</div>'
    );
  }
}

function showChannel(channel, unread, targetUrl) {
  var members = channel.members;
  var channelMemberList = '';
  $.each(members, function(index, member) {
    if (currentUser.userId != member.userId) {
      channelMemberList += member.nickname + ', ';
    }
  });
  channelMemberList = channelMemberList.slice(0, -2);
  addMessagingChannel(true, channelMemberList, channel);

  if (unread != 0) {
    $.each($('.left-nav-channel'), function(index, item) {
      if ($(item).data("channel-url") == targetUrl) {
        addUnreadCount(item, unread, targetUrl);
      }
    });
  }
}
/***********************************************
 *          // END Common Function
 **********************************************/


$('.right-section__modal-bg').click(function() {
  navInit();
  popupInit();
});

function navInit() {
  $('.right-section__modal-bg').hide();

  // OPEN CHAT
  $('#btn_open_chat').removeClass('left-nav-open--active');
  $('.modal-open-chat').hide();

  // MESSAGING
  $('#btn_messaging_chat').removeClass('left-nav-messaging--active');
  $('.modal-messaging').hide();
}

function popupInit() {
  $('.modal-member').hide();
  $('.chat-top__button-member').removeClass('chat-top__button-member--active');
  $('.modal-invite').hide();
  $('.chat-top__button-invite').removeClass('chat-top__button-invite--active');
}

function init() {
  userId = decodeURI(decodeURIComponent(getUrlVars()['userid']));
  userId = checkUserId(userId);
  nickname = decodeURI(decodeURIComponent(getUrlVars()['nickname']));

  $('.init-check').show();
  startSendBird(userId, nickname);
  $('.left-nav-user-nickname').html(nickname);
}

$(document).ready(function() {
  notifyMe();
  init();
});

window.onfocus = function() {
  if (currChannelInfo && !currChannelInfo.isOpenChannel()) {
     currChannelInfo.markAsRead();
  }
  $.each($('.left-nav-channel'), function(index, item) {
    if ($(item).data("channel-url") == currChannelUrl) {
      $(item).find('div[class="left-nav-channe__unread"]').remove();
    }
  });
};

