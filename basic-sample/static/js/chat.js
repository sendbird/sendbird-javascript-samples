
var appId = 'A7A2672C-AD11-11E4-8DAA-0A18B21C2D82';
var currScrollHeight = 0;
var MESSAGE_TEXT_HEIGHT = 27;

var nickname = null;
var guestId = null;
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
    getChannelList(1);
  }
});

$('.modal-open-chat-more').click(function() {
  getChannelList(channelListPage + 1);
});

function getChannelList(page) {
  if(page == 1) {
    $('.modal-open-chat-list').html('');
  }
  sendbird.getChannelList({
    "page": page,
    "limit": 20,
    "successFunc" : function(data) {
      $('.modal-open-chat-list').append(createChannelList(data));
      channelListPage = data['page'];
      if (data['next'] != 0) {
        $('.modal-open-chat-more').show();
      } else {
        $('.modal-open-chat-more').hide();
      }
      $('.modal-open-chat').show();
    },
    "errorFunc": function(status, error) {
      console.log(status, error);
    }
  });
}

function createChannelList(obj) {
  var channelListHtml = '';
  $.each(obj['channels'], function(index, channel) {
    channelListHtml += '' +
      '<div class="modal-open-chat-list__item" onclick="joinChannel(\''+ channel['channel_url'] +'\')">' +
      channel['name'] +
      '</div>';
  });
  return channelListHtml;
}

$('#modal_open_chat_search').keydown(function(event) {
  if (event.keyCode == 13) {
    sendbird.getChannelSearch({
      "query": $(this).val(),
      "successFunc" : function(data) {
        $('.modal-open-chat-list').html('');
        $('.modal-open-chat-list').append(createChannelList(data));
        channelListPage = data['page'];
        if (data['next'] != 0) {
          $('.modal-open-chat-more').show();
        } else {
          $('.modal-open-chat-more').hide();
        }
      },
      "errorFunc": function(status, error) {
        console.log(status, error);
      }
    });
  }
});

function joinChannel(channelUrl) {
  if (channelUrl == currChannelUrl) {
    navInit();
    popupInit();
    return false;
  }

  sendbird.joinChannel(
    channelUrl,
    {
      "successFunc": function(data) {
        currChannelInfo = data;
        currChannelUrl = currChannelInfo['channel_url'];

        $('.chat-empty').hide();
        initChatTitle(currChannelInfo['name'], 0);
        $('.chat-canvas').html('');
        $('.chat-input-text__field').val('');
        $('.chat').show();

        navInit();
        popupInit();

        sendbird.connect({
          "successFunc": function(data) {
            isOpenChat = true;
            loadMoreChatMessage(scrollPositionBottom);
            setWelcomeMessage(currChannelInfo['name']);
            addChannel();
            $('.chat-input-text__field').attr('disabled', false);
          },
          "errorFunc": function(status, error) {
            console.log(status, error);
          }
        });
      },
      "errorFunc": function(status, error) {
        console.log(status, error);
      }
    }
  );

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
      '     onclick="joinChannel(\'' + currChannelInfo["channel_url"] + '\')"' +
      '     data-channel-url="' + currChannelInfo["channel_url"] + '"' +
      '>' +
      (currChannelInfo["name"].length > 12 ? currChannelInfo["name"].substring(0, 12) + '...' : currChannelInfo["name"]) +
      '  <div class="left-nav-channel-leave" onclick="leaveChannel(currChannelInfo, $(this))"></div>' +
      '</div>'
    );
  }

  $('.modal-guide-create').hide();
  $('.left-nav-button-guide').hide();
}

function leaveChannel(channel, obj) {
  popupInit();

  leaveChannelUrl = channel['channel_url'];

  if (obj.hasClass('chat-top__button')) {
    obj.addClass('chat-top__button-leave--active');
  } else {
    obj.addClass('left-nav-channel-leave--active');
  }

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
    getMemberList(currChannelUrl);
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

function getMemberList(channelUrl) {
  sendbird.getMemberList(
    channelUrl,
    {
      "successFunc" : function(data) {
        $('.modal-member-list').html('');
        var memberListHtml = '';
        $.each(data['members'], function(index, member) {
          memberListHtml += '' +
            '<div class="modal-member-list__item">' +
            (member['is_online'] ? '<div class="modal-member-list__icon modal-member-list__icon--online"></div>' : '<div class="modal-member-list__icon"></div>') +
            '  <div class="modal-member-list__name">' +
            (member['nickname'].length > 13 ? member['nickname'].substring(0, 12) + '...' : member['nickname']) +
            '  </div>' +
            '</div>';
        });
        $('.modal-member-list').html(memberListHtml);
      },
      "errorFunc": function(status, error) {
        console.log(status, error);
      }
    }
  );
}

$('.modal-leave-channel-close').click(function() {
  $('.left-nav-channel-leave').removeClass('left-nav-channel-leave--active');
  $('.chat-top__button-leave').removeClass('chat-top__button-leave--active');
  $('.modal-leave-channel').hide();
  leaveChannelUrl = '';
  return false;
});

$('.modal-leave-channel-submit').click(function() {
  $('#open_channel_list').removeClass('chat-top__button-leave--active');
  $('.chat-top__button-leave').removeClass('left-nav-channel-leave--active');

  if (!leaveChannelUrl.isEmpty()) {
    sendbird.leaveChannel(
      leaveChannelUrl,
      {
        "successFunc": function(data) {
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
          sendbird.disconnect();
          sendbird.connect();
        },
        "errorFunc": function(status, error) {
          console.log(status, error);
        }
      }
    );
  } else if (!leaveMessagingChannelUrl.isEmpty()) {
    sendbird.endMessaging(
      leaveMessagingChannelUrl,
      {
        "successFunc" : function(data) {
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
          sendbird.disconnect();
          sendbird.connect();
        },
        "errorFunc": function(status, error) {
          console.log(status, error);
        }
      }
    );
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

function getUserList(options) {
  options = $.extend({}, {"page": 1, "token": '', "limit": 30}, options);
  if (options["page"] == 1 && options["token"] == '') {
    $('.modal-messaging-list').html('');
  }

  sendbird.getUserList({
    "token": options["token"],
    "page": options["page"],
    "limit": options["limit"],
    "successFunc" : function(data) {
      userListToken = data["token"];
      userListNext = data["next"];
      var users = data["users"];

      $('.modal-messaging-more').remove();
      $.each(users, function(index, user) {
        if (!isCurrentUser(user["guest_id"])) {
          $('.modal-messaging-list').append(
            '<div class="modal-messaging-list__item" onclick="userClick($(this))">' +
            (user["nickname"].length > 12 ? user["nickname"].substring(0, 12) + '...' : user["nickname"]) +
            '  <div class="modal-messaging-list__icon" data-guest-id="' + user["guest_id"] + '"></div>' +
            '</div>'
          );
        }
      });

      if (userListNext != 0) {
        $('.modal-messaging-list').append(
          '<div class="modal-messaging-more" onclick="userListLoadMore()">MORE<div class="modal-messaging-more__icon"></div></div>'
        );
      } else {
        $('.modal-messaging-more').remove();
      }
    },
    "errorFunc": function(status, error) {
      console.log(status, error);
    }
  });
}

function userListLoadMore() {
  getUserList({"token": userListToken, "page": userListNext, "limit": 30});
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
    $('.modal-messaging-top__title').html('1on1 Chat');
  }
}

function startMessaging() {
  if ($('.modal-messaging-list__icon--select').length == 0) {
    alert('Please select user');
    return false;
  }

  var guestIds = [];
  $.each($('.modal-messaging-list__icon--select'), function(index, user) {
    guestIds.push($(user).data("guest-id"));
  });

  sendbird.startMessaging(
    guestIds,
    {
      "successFunc": function(data) {
        currChannelInfo = data['channel'];
        currChannelUrl = currChannelInfo['channel_url'];

        var members = data["members"];
        var channelTitle = '';
        $.each(members, function(index, member) {
          if (!isCurrentUser(member['guest_id'])) {
            channelTitle += member['name'] + ', ';
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
        if(members.length > 2) {
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

        sendbird.connect({
          "successFunc": function(data) {
            loadMoreChatMessage(scrollPositionBottom);
            setWelcomeMessage('Messaging Channel');
            addMessagingChannel(isGroup, channelMemberList, currChannelInfo);
            sendbird.markAsRead(currChannelInfo['channel_url']);
            $('.chat-input-text__field').attr('disabled', false);
          },
          "errorFunc": function(status, error) {
            console.log(status, error);
          }
        });
      },
      "errorFunc": function(status, error) {
        console.log(status, error);
      }
    }
  );
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
      $(channel).find('div[class="left-nav-channel-leave"]').attr('style', '');
      $(channel).find('div[class="left-nav-channe__unread"]').remove();
      sendbird.markAsRead(currChannelUrl);
      addFlag = false;
    }
  });
  $.each($('.left-nav-channel-group'), function(index, channel) {
    if (currChannelUrl == $(channel).data('channel-url')) {
      $(channel).addClass('left-nav-channel-group--active');
      $(channel).find('div[class="left-nav-channel-leave"]').attr('style', '');
      $(channel).find('div[class="left-nav-channe__unread"]').remove();
      sendbird.markAsRead(currChannelUrl);
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
      '     onclick="joinMessagingChannel(\'' + targetChannel["channel_url"] + '\')"' +
      '     data-channel-url="' + targetChannel["channel_url"] + '"' +
      '>' +
      channelMemberList +
      '  <div class="left-nav-channel-leave" onclick="endMessaging(targetAddMessagingChannel, $(this))"></div>' +
      '</div>'
    );
  } else if (addFlag && isGroup) {
    $('#messaging_channel_list').append(
      '<div class="left-nav-channel left-nav-channel-group left-nav-channel-group--active" ' +
      '     onclick="joinMessagingChannel(\'' + targetChannel["channel_url"] + '\')"' +
      '     data-channel-url="' + targetChannel["channel_url"] + '"' +
      '>' +
      channelMemberList +
      '  <div class="left-nav-channel-leave" onclick="endMessaging(targetAddMessagingChannel, $(this))"></div>' +
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
        $(channel).find('div[class="left-nav-channel-leave"]').attr('style', '');
        $(channel).find('div[class="left-nav-channe__unread"]').remove();
      }
    });
    sendbird.markAsRead(channelUrl);
    return false;
  }

  sendbird.joinMessagingChannel(
    channelUrl,
    {
      "successFunc" : function(data) {
        currChannelInfo = data['channel'];
        currChannelUrl = currChannelInfo['channel_url'];

        var members = data["members"];
        var channelTitle = '';
        $.each(members, function(index, member) {
          if (!isCurrentUser(member['guest_id'])) {
            channelTitle += member['name'] + ', ';
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
        if(members.length > 2) {
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

        sendbird.connect({
          "successFunc": function(data) {
            loadMoreChatMessage(scrollPositionBottom);
            setWelcomeMessage('Messaging Channel');
            addMessagingChannel(isGroup, channelMemberList, currChannelInfo);
            $('.chat-input-text__field').attr('disabled', false);
          },
          "errorFunc": function(status, error) {
            console.log(status, error);
          }
        });
      },
      "errorFunc": function(status, error) {
        console.log(status, error);
      }
    }
  );
}

function endMessaging(channel, obj) {
  popupInit();

  leaveMessagingChannelUrl = channel['channel_url'];

  if (obj.hasClass('chat-top__button')) {
    obj.addClass('chat-top__button-leave--active');
  } else {
    obj.addClass('left-nav-channel-leave--active');
  }

  $('.modal-leave-channel-desc').html('Do you want to leave this messaging channel?');
  $('.modal-leave-channel').show();
  return false;
}

function inviteMember() {
  if ($('.modal-messaging-list__icon--select').length == 0) {
    alert('Please select user');
    return false;
  }

  var guestIds = [];
  $.each($('.modal-messaging-list__icon--select'), function(index, user) {
    guestIds.push($(user).data("guest-id"));
  });

  sendbird.inviteMessaging(
    guestIds,
    {
      "successFunc": function(data) {
        currChannelInfo = data['channel'];
        currChannelUrl = currChannelInfo['channel_url'];

        var members = data["members"];
        var channelTitle = '';
        $.each(members, function(index, member) {
          if (!isCurrentUser(member['guest_id'])) {
            channelTitle += member['name'] + ', ';
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
        if(members.length > 2) {
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

        sendbird.connect({
          "successFunc": function(data) {
            loadMoreChatMessage(scrollPositionBottom);
            setWelcomeMessage('Messaging Channel');
            addMessagingChannel(isGroup, channelMemberList, currChannelInfo);
            sendbird.markAsRead(currChannelInfo['channel_url']);
            $('.chat-input-text__field').attr('disabled', false);
          },
          "errorFunc": function(status, error) {
            console.log(status, error);
          }
        });
      },
      "errorFunc": function(status, error) {
        console.log(status, error);
      }
    }
  );
}

function getMessagingChannelList() {
  sendbird.getMessagingChannelList({
    "successFunc": function(data) {
      $.each(data['channels'], function(index, channel) {
        var channelMemberList = '';
        $.each(channel["members"], function(index, member) {
          if (!isCurrentUser(member['guest_id'])) {
            channelMemberList += member['name'] + ', ';
          }
        });
        channelMemberList = channelMemberList.slice(0, -2);
        var groupCheck = sendbird.isGroupMessaging(channel["channel_type"]);
        addMessagingChannel(groupCheck, channelMemberList, channel["channel"]);

        $.each($('.left-nav-channel'), function(index, item) {
          $(item).removeClass('left-nav-channel-messaging--active');
          $(item).removeClass('left-nav-channel-group--active');
        });
        var targetUrl = channel["channel"]["channel_url"];
        var unread = channel['unread_message_count'];
        if (unread != 0) {
          $.each($('.left-nav-channel'), function(index, item) {
            if ($(item).data("channel-url") == targetUrl) {
              addUnreadCount(item, unread, targetUrl);
            }
          });
        }
      });
    },
    "errorFunc": function(status, error) {
      console.log(status, error);
    }
  });
}

function makeMemberList(members) {
  var item = {};
  //Clear memberList before updating it
  memberList = [];
  $.each(members, function(index, member) {
    item = {};
    if (!isCurrentUser(member['guest_id'])) {
      item["guest_id"] = member["guest_id"];
      item["name"] = member["name"];
      memberList.pushUnique(item);
    }
  });
}
/***********************************************
 *            // END MESSAGING
 **********************************************/


/***********************************************
 *            SendBird Settings
 **********************************************/
function startSendBird(guestId, nickName) {
  sendbird.init({
    "app_id": appId,
    "guest_id": guestId,
    "user_name": nickName,
    "image_url": '',
    "access_token": '',
    "successFunc": function(data) {
      $('.init-check').hide();
      getMessagingChannelList();
      sendbird.connect();
    },
    "errorFunc": function(status, error) {
      console.log(status, error);

      if (error == 'Request Domain is not authentication.') {
        alert(error);
      } else {
        alert('please check your access code');
      }
      window.location.href = '/';
    }
  });

  sendbird.events.onMessageReceived = function(obj) {
    setChatMessage(obj);
  };

  sendbird.events.onSystemMessageReceived = function(obj) {
    setSysMessage(obj);
  };

  sendbird.events.onFileMessageReceived = function(obj) {
    if (sendbird.hasImage(obj)) {
      setImageMessage(obj);
    } else {
      setFileMessage(obj);
    }
  };

  sendbird.events.onBroadcastMessageReceived = function(obj) {
    setBroadcastMessage(obj);
  };

  sendbird.events.onMessagingChannelUpdateReceived = function(obj) {
    unreadCountUpdate(obj);
  };

  sendbird.events.onTypeStartReceived = function(obj) {
    var userId = obj['user']['guest_id'];
    $.each(memberList, function(index, member) {
      if (member['guest_id'] == userId) {
        isTyping = true;

        $.each(typingUser, function(index, user) {
          if (user['user']['guest_id'] == userId) {
            isTyping = false;
          }
        });

        if (isTyping) {
          typingUser.push(obj);
        }
      }
    });

    if (isTyping) {
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

  };

  sendbird.events.onTypeEndReceived = function(obj) {
    endTyping(obj['user']['guest_id']);
  };

  sendbird.events.onReadReceived = function(obj) {
    console.log(obj);
  };

  sendbird.events.onMessageDelivery = function(obj) {
    console.log(obj);
  };

  sendbird.setDebugMessage(false);
}

var checkTyping = setInterval(function() {
  var now = new Date().getTime();
  $.each(typingUser, function(index, user) {
    var typingTime = user["ts"];
    if (now - typingTime > TYPE_CHECK_TIME) {
      endTyping(user['user']['guest_id']);
    }
  });
}, TYPE_CHECK_TIME);

function endTyping(userId) {
  var temp = [];
  $.each(typingUser, function(index, user) {
    if (user['user']['guest_id'] != userId) {
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

function loadMoreChatMessage(func) {
  sendbird.getMessageLoadMore({
    "limit": 50,
    "successFunc": function(data) {
      var moreMessage = data["messages"];
      var msgList = '';
      $.each(moreMessage.reverse(), function(index, msg) {
        if (sendbird.isMessage(msg.cmd)) {
          msgList += messageList(msg.payload);
        } else if (sendbird.isFileMessage(msg.cmd)) {
          if (!sendbird.hasImage(msg.payload)) {
            msgList += fileMessageList(msg.payload);
          } else {
            msgList += imageMessageList(msg.payload);
          }
        }
      });
      $('.chat-canvas').prepend(msgList);
      $('.chat-canvas')[0].scrollTop = (moreMessage.length * MESSAGE_TEXT_HEIGHT);
      if (func != undefined) func();
    },
    "errorFunc": function(status, error) {
      console.log(status, error);
    }
  });
}

function messageList(obj) {
  var msgList = '';
  if (isCurrentUser(obj['user']['guest_id'])) {
    msgList += '' +
      '<div class="chat-canvas__list">' +
      '  <label class="chat-canvas__list-name chat-canvas__list-name__user">' +
      nameInjectionCheck(obj['user']['name']) +
      '  </label>' +
      '  <label class="chat-canvas__list-separator">:</label>' +
      '  <label class="chat-canvas__list-text">' +
      convertLinkMessage(obj['message']) +
      '  </label>' +
      '</div>';
  } else {
    msgList += '' +
      '<div class="chat-canvas__list">' +
      '  <label class="chat-canvas__list-name">' +
      nameInjectionCheck(obj['user']['name']) +
      '  </label>' +
      '  <label class="chat-canvas__list-separator">:</label>' +
      '  <label class="chat-canvas__list-text">' +
      convertLinkMessage(obj['message']) +
      '  </label>' +
      '</div>';
    if (!document.hasFocus()) {
      notifyMessage(obj['message']);
    }
  }
  return msgList;
}

function fileMessageList(obj) {
  var msgList = '';
  if (isCurrentUser(obj['user']['guest_id'])) {
    msgList += '' +
      '<div class="chat-canvas__list">' +
      '  <label class="chat-canvas__list-name chat-canvas__list-name__user">' +
      nameInjectionCheck(obj['user']['name']) +
      '  </label>' +
      '  <label class="chat-canvas__list-separator">:</label>' +
      '  <label class="chat-canvas__list-text">' +
      '    <label class="chat-canvas__list-text-file">FILE</label>' +
      '    <a href="' + obj['url'] + '" target="_blank">' + obj['name'] + '</a>' +
      '  </label>' +
      '</div>';
  } else {
    msgList += '' +
      '<div class="chat-canvas__list">' +
      '  <label class="chat-canvas__list-name">' +
      nameInjectionCheck(obj['user']['name']) +
      '  </label>' +
      '  <label class="chat-canvas__list-separator">:</label>' +
      '  <label class="chat-canvas__list-text">' +
      '    <label class="chat-canvas__list-text-file">FILE</label>' +
      '    <a href="' + obj['url'] + '" target="_blank">' + obj['name'] + '</a>' +
      '  </label>' +
      '</div>';
    if (!document.hasFocus()) {
      notifyMessage(obj['message']);
    }
  }
  return msgList;
}

function imageMessageList(obj) {
  var msgList = '';
  if (isCurrentUser(obj['user']['guest_id'])) {
    msgList += '' +
      '<div class="chat-canvas__list">' +
      '  <label class="chat-canvas__list-name chat-canvas__list-name__user">' +
      nameInjectionCheck(obj['user']['name']) +
      '  </label>' +
      '  <label class="chat-canvas__list-separator">:</label>' +
      '  <label class="chat-canvas__list-text">' +
      obj['name'] +
      '  </label>' +
      '  <div class="chat-canvas__list-file" onclick="window.open(\'' + obj['url'] + '\', \'_blank\');">' +
      '    <img src="' + obj['url'] + '" class="chat-canvas__list-file-img" onload="afterImageLoad(this)">' +
      '  </div>' +
      '</div>';
  } else {
    msgList += '' +
      '<div class="chat-canvas__list">' +
      '  <label class="chat-canvas__list-name">' +
      nameInjectionCheck(obj['user']['name']) +
      '  </label>' +
      '  <label class="chat-canvas__list-separator">:</label>' +
      '  <label class="chat-canvas__list-text">' +
      obj['name'] +
      '  </label>' +
      '  <div class="chat-canvas__list-file" onclick="window.open(\'' + obj['url'] + '\', \'_blank\');">' +
      '    <img src="' + obj['url'] + '" class="chat-canvas__list-file-img" onload="afterImageLoad(this)">' +
      '  </div>' +
      '</div>';
    if (!document.hasFocus()) {
      notifyMessage(obj['message']);
    }
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
      sendbird.message($.trim(this.value));
      scrollPositionBottom();
    }
    this.value = "";
  } else {
    if (!$.trim(this.value).isEmpty()) {
      if (!isOpenChat) {
        sendbird.typeStart();
      }
    }
  }
});

$('#chat_file_input').change(function() {
  if ($('#chat_file_input').val().trim().length == 0) return;
  var file = $('#chat_file_input')[0].files[0];
  $('.chat-input-file').addClass('file-upload');
  sendbird.sendFile(
    file,
    {
      "successFunc" : function(data) {
        $('.chat-input-file').removeClass('file-upload');
        $('#chat_file_input').val('');
        console.log(data.url);
      },
      "errorFunc": function(status, error) {
        $('.chat-input-file').removeClass('file-upload');
        $('#chat_file_input').val('');
        console.log(status, error);
        alert('file size too large.\nplease select less than 25MB.');
      }
    }
  );

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

function unreadCountUpdate(data) {
  var targetUrl = data['channel']['channel_url'];

  var callAdd = true;
  var unread = data['unread_message_count'] > 9 ? '9+' : data['unread_message_count'];
  if (unread > 0 || unread == '9+') {
    $.each($('.left-nav-channel'), function(index, item) {
      if ($(item).data("channel-url") == targetUrl) {
        addUnreadCount(item, unread, targetUrl);
        callAdd = false;
      }
    });

    if (callAdd) {
      showChannel(data, unread, targetUrl);
    }
  } else {
    showChannel(data, unread, targetUrl);
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
    $(item).find('div[class="left-nav-channel-leave"]').hide();
  }
}

function showChannel(data, unread, targetUrl) {
  var members = data["members"];
  var channelMemberList = '';
  $.each(members, function(index, member) {
    if (!isCurrentUser(member['guest_id'])) {
      channelMemberList += member['name'] + ', ';
    }
  });
  channelMemberList = channelMemberList.slice(0, -2);
  var groupCheck = sendbird.isGroupMessaging(data["channel_type"]);
  addMessagingChannel(groupCheck, channelMemberList, data["channel"]);

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
  guestId = checkGuestId();
  nickname = decodeURI(decodeURIComponent(getUrlVars()['nickname']));
  $('.init-check').show();
  startSendBird(guestId, nickname);
  $('.left-nav-user-nickname').html(nickname);
}

$(document).ready(function() {
  notifyMe();
  init();
});

window.onfocus = function() {
  if (!isOpenChat && currChannelUrl != null) {
    sendbird.markAsRead(currChannelUrl);
  }
  $.each($('.left-nav-channel'), function(index, item) {
    if ($(item).data("channel-url") == currChannelUrl) {
      $(item).find('div[class="left-nav-channe__unread"]').remove();
      $(item).find('div[class="left-nav-channel-leave"]').attr('style', '');
    }
  });
};

