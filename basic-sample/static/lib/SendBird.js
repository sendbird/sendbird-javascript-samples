/*
 * Copyright (c) 2016 SendBird, Inc.
 */
(function(root, factory) {
  root.SendBird = factory;
})(this, function (initParams) {
  /***********************************
   * Admin Message Class Static
   ***********************************/
  AdminMessage.build = function (msgId, channel, message, data, createdAt) {
    return {
      msg_id: msgId,
      channel_url: channel.url,
      channel_type: channel.isOpenChannel() ? BaseChannel.CHANNEL_TYPE_OPEN : BaseChannel.CHANNEL_TYPE_GROUP,
      ts: createdAt,
      message: message,
      data: data
    };
  };

  /***********************************
   * Admin Message Class
   ***********************************/
  function AdminMessage(jsonObject) {
    var base = new BaseMessage(jsonObject);
    base.messageType = BaseMessage.MESSAGE_TYPE_ADMIN;
    base.message;
    base.data;

    if (!jsonObject) {
      return base;
    }
    /************************************
     * Constructor
     */

    base.message = String(jsonObject['message']);
    base.data = jsonObject.hasOwnProperty("data") ? String(jsonObject['data']) : "";

    return base;
  };

  /***********************************
   * APIClient Class Static Method
   ***********************************/
  APIClient.sInstance = null;
  APIClient.init = function () {
    if (!APIClient.sInstance) {
      APIClient.sInstance = new APIClient();
    }
  };
  APIClient.getInstance = function () {
    if (!APIClient.sInstance) {
      debug.error("SendBird instance hasn't been initialized. Try SendBird.init().");
      // throw new runtimeException("SendBird instance hasn't been initialized.");
      return null;
    } else {
      return APIClient.sInstance;
    }
  };

  // SDK v3 API
  APIClient.API_VERSION = 'v3';
  APIClient.API_ROUTING_URL = "https://api.sendbird.com/routing/%s";
  APIClient.API_USERS = "/%v/users".replace('%v', APIClient.API_VERSION);
  APIClient.API_USERS_USERID_LOGIN = "/%v/users/%s/login".replace('%v', APIClient.API_VERSION);
  APIClient.API_USERS_USERID = "/%v/users/%s".replace('%v', APIClient.API_VERSION);
  APIClient.API_USERS_USERID_MARKASREADALL = "/%v/users/%s/mark_as_read_all".replace('%v', APIClient.API_VERSION);
  APIClient.API_USERS_USERID_PUSH_GCM_TOKEN = "/%v/users/%s/push/gcm/%s".replace('%v', APIClient.API_VERSION);
  APIClient.API_USERS_USERID_PUSH_GCM = "/%v/users/%s/push/gcm".replace('%v', APIClient.API_VERSION);
  APIClient.API_USERS_USERID_BLOCK = "/%v/users/%s/block".replace('%v', APIClient.API_VERSION);
  APIClient.API_USERS_USERID_BLOCK_TARGETID = "/%v/users/%s/block/%s".replace('%v', APIClient.API_VERSION);
  APIClient.API_USERS_USERID_PUSH_APNS_TOKEN = "/%v/users/%s/push/apns/%s".replace('%v', APIClient.API_VERSION);
  APIClient.API_USERS_USERID_PUSH_APNS = "/%v/users/%s/push/apns".replace('%v', APIClient.API_VERSION);
  APIClient.API_USERS_USERID_PUSH = "/%v/users/%s/push".replace('%v', APIClient.API_VERSION);
  APIClient.API_OPENCHANNELS = "/%v/open_channels".replace('%v', APIClient.API_VERSION);
  APIClient.API_OPENCHANNELS_CHANNELURL = "/%v/open_channels/%s".replace('%v', APIClient.API_VERSION);
  APIClient.API_OPENCHANNELS_CHANNELURL_MESSAGES = "/%v/open_channels/%s/messages".replace('%v', APIClient.API_VERSION);
  APIClient.API_OPENCHANNELS_CHANNELURL_MESSAGES_MESSAGEID = "/%v/open_channels/%s/messages/%s".replace('%v', APIClient.API_VERSION);
  APIClient.API_OPENCHANNELS_CHANNELURL_PARTICIPANTS = "/%v/open_channels/%s/participants".replace('%v', APIClient.API_VERSION);
  APIClient.API_OPENCHANNELS_CHANNELURL_METADATA = "/%v/open_channels/%s/metadata".replace('%v', APIClient.API_VERSION);
  APIClient.API_OPENCHANNELS_CHANNELURL_METADATA_KEY = "/%v/open_channels/%s/metadata/%s".replace('%v', APIClient.API_VERSION);
  APIClient.API_OPENCHANNELS_CHANNELURL_METACOUNTER = "/%v/open_channels/%s/metacounter".replace('%v', APIClient.API_VERSION);
  APIClient.API_OPENCHANNELS_CHANNELURL_METACOUNTER_KEY = "/%v/open_channels/%s/metacounter/%s".replace('%v', APIClient.API_VERSION);
  APIClient.API_OPENCHANNELS_CHANNELURL_BAN = "/%v/open_channels/%s/ban".replace('%v', APIClient.API_VERSION);;
  APIClient.API_OPENCHANNELS_CHANNELURL_BAN_USERID = "/%v/open_channels/%s/ban/%s".replace('%v', APIClient.API_VERSION);;
  APIClient.API_OPENCHANNELS_CHANNELURL_MUTE = "/%v/open_channels/%s/mute".replace('%v', APIClient.API_VERSION);;
  APIClient.API_OPENCHANNELS_CHANNELURL_MUTE_USERID = "/%v/open_channels/%s/mute/%s".replace('%v', APIClient.API_VERSION);;
  APIClient.API_GROUPCHANNELS = "/%v/group_channels".replace('%v', APIClient.API_VERSION);
  APIClient.API_GROUPCHANNELS_CHANNELURL = "/%v/group_channels/%s".replace('%v', APIClient.API_VERSION);
  APIClient.API_GROUPCHANNELS_CHANNELURL_INVITE = "/%v/group_channels/%s/invite".replace('%v', APIClient.API_VERSION);
  APIClient.API_GROUPCHANNELS_CHANNELURL_HIDE = "/%v/group_channels/%s/hide".replace('%v', APIClient.API_VERSION);
  APIClient.API_GROUPCHANNELS_CHANNELURL_LEAVE = "/%v/group_channels/%s/leave".replace('%v', APIClient.API_VERSION);
  APIClient.API_GROUPCHANNELS_CHANNELURL_MESSAGES = "/%v/group_channels/%s/messages".replace('%v', APIClient.API_VERSION);
  APIClient.API_GROUPCHANNELS_CHANNELURL_MESSAGES_MARKASREAD = "/%v/group_channels/%s/messages/mark_as_read".replace('%v', APIClient.API_VERSION);
  APIClient.API_GROUPCHANNELS_CHANNELURL_MESSAGES_TOTALCOUNT = "/%v/group_channels/%s/messages/total_count".replace('%v', APIClient.API_VERSION);
  APIClient.API_GROUPCHANNELS_CHANNELURL_MESSAGES_UNREADCOUNT = "/%v/group_channels/%s/messages/unread_count".replace('%v', APIClient.API_VERSION);
  APIClient.API_GROUPCHANNELS_CHANNELURL_MESSAGES_MESSAGEID = "/%v/group_channels/%s/messages/%s".replace('%v', APIClient.API_VERSION);
  APIClient.API_GROUPCHANNELS_CHANNELURL_MEMBERS = "/%v/group_channels/%s/members".replace('%v', APIClient.API_VERSION);
  APIClient.API_GROUPCHANNELS_CHANNELURL_METADATA = "/%v/group_channels/%s/metadata".replace('%v', APIClient.API_VERSION);
  APIClient.API_GROUPCHANNELS_CHANNELURL_METADATA_KEY = "/%v/group_channels/%s/metadata/%s".replace('%v', APIClient.API_VERSION);
  APIClient.API_GROUPCHANNELS_CHANNELURL_METACOUNTER = "/%v/group_channels/%s/metacounter".replace('%v', APIClient.API_VERSION);
  APIClient.API_GROUPCHANNELS_CHANNELURL_METACOUNTER_KEY = "/%v/group_channels/%s/metacounter/%s".replace('%v', APIClient.API_VERSION);
  APIClient.API_STORAGE_FILE = "/%v/storage/file".replace('%v', APIClient.API_VERSION);
  APIClient.API_STORAGE_PROFILE = "/%v/storage/profile".replace('%v', APIClient.API_VERSION);
  APIClient.MIME_JSON = "application/json; charset=utf-8";

  APIClient.UPDATE_META_COUNTER_MODE_SET = 0;
  APIClient.UPDATE_META_COUNTER_MODE_INC = 1;
  APIClient.UPDATE_META_COUNTER_MODE_DEC = 2;


  /***********************************
   * APIClient Class
   ***********************************/
  function APIClient() {
    this.sessionKey;
    var APIHost;
    var WSHost;

    var routingUpdatedAt = 0;
    var sbRouterTimer = 0;

    // //console.log(self);
    var API_HEADER_PARAM = 'JS,' + self.OSVersion + ',' + self.SDKVersion + ',' + self.appId;

    this.checkRouting = function (cb) {
      if (DEBUG_HOST) {
        if (typeof cb == 'function') {
          cb({API_HOST: API_HOST, WS_HOST: WS_HOST});
        }
      } else {
        var now = (new Date().getTime() / 1000);
        if (sbRouterTimer == 0 || (sbRouterTimer - now) > 300) {
          //console.log('checkRouting renew');
          _ajaxCall(APIClient.API_ROUTING_URL.replace("%s", self.appId), {}, 'GET', {"SendBird": API_HEADER_PARAM + self.appId},
            function (result, error) {
              if (error) {
                cb(null, new SendBirdException('Server is unreachable.', SendBirdError.NETWORK_ROUTING_ERROR));
                return;
              }
              WS_HOST = result.ws_server;
              API_HOST = result.api_server;
              //console.log('Routing Info Update: ' + WS_HOST + ', ' + API_HOST);

              sbRouterTimer = now;
              if (typeof cb == 'function') {
                cb({API_HOST: API_HOST, WS_HOST: WS_HOST});
              }
            }, function (errCode, errTxt) {
              //console.log('error: ' + errTxt);

              cb(null, new SendBirdException(errTxt, errCode));
            }
          );
        } else {
          cb(null, null);
        }
      }
    };

    var requestFILE = function (url, form, file, cb) {
      // TODO: sessionKey undefined bug!!
      //console.log('SessionKey:', self.APIClient.sessionKey);
      APIClient.sInstance.checkRouting(function (result, error) {
        if (error) {
          debug.error(error);
          cb(null, new SendBirdException('Request failed.', SendBirdError.REQUEST_FAILED));
        } else {
          var request = new XMLHttpRequest();
          request.open('POST', API_HOST + url, true);
          request.setRequestHeader('SendBird', API_HEADER_PARAM + appId);
          request.setRequestHeader('Session-Key', self.APIClient.sessionKey);

          var formData = new FormData();
          formData.append('file', file);

          request.onload = function () {
            cb(request.response);
          };

          request.onerror = function (e) {
            cb(null, new SendBirdException(request.statusText, SendBirdError.REQUEST_FAILED));
          };

          request.send(formData);
        }
      });
    };

    var requestDELETE = function (url, params, cb) {
      if (typeof params == 'function') {
        cb = params;
        params = {};
      }

      APIClient.sInstance.checkRouting(function (result, error) {
        if (error) {
          //console.log(error);
          cb(null, new SendBirdException('Request failed.', SendBirdError.REQUEST_FAILED));
        } else {
          _ajaxCall(API_HOST + url, params, 'DELETE', {
            "Session-Key": self.APIClient.sessionKey,
            "SendBird": API_HEADER_PARAM + appId
          }, cb);
        }
      });
    };

    var requestGET = function (url, params, cb) {
      if (typeof params == 'function') {
        cb = params;
        params = {};
      }

      var fullUrl;
      var urlParams = '';
      if (params) {
        for (var key in params) {
          if (urlParams != "") {
            urlParams += "&";
          }
          urlParams += key + "=" + encodeURIComponent(params[key]);
        }

        fullUrl = API_HOST + url + '?' + urlParams;
      } else {
        fullUrl = API_HOST + url;
      }

      APIClient.sInstance.checkRouting(function (result, error) {
        if (error) {
          cb(null, new SendBirdException('Request failed.', SendBirdError.REQUEST_FAILED));
        } else {
          _ajaxCall(fullUrl, params, 'GET', {
            "Session-Key": self.APIClient.sessionKey,
            "SendBird": API_HEADER_PARAM + appId
          }, cb);
        }
      });
    };

    var requestPOST = function (url, params, cb) {
      if (typeof params == 'function') {
        cb = params;
        params = {};
      }

      APIClient.sInstance.checkRouting(function (result, error) {
        if (error) {
          //console.log(error);
        } else {
          _ajaxCall(API_HOST + url, params, 'POST', {
            "Session-Key": self.APIClient.sessionKey,
            "SendBird": API_HEADER_PARAM + appId
          }, cb);
        }
      });
    };

    var requestPUT = function (url, params, cb) {
      if (typeof params == 'function') {
        cb = params;
        params = {};
      }

      APIClient.sInstance.checkRouting(function (result, error) {
        if (error) {
          //console.log(error);
        } else {
          _ajaxCall(API_HOST + url, params, 'PUT', {
            "Session-Key": self.APIClient.sessionKey,
            "SendBird": API_HEADER_PARAM + appId
          }, cb);
        }
      });
    };

    var _ajaxCall = function (url, data, method, header, cb) {
      // //console.log('_ajaxCall: ' + url);

      var _AJAX_SUCCESS_CODE = 200;
      var _AJAX_ERROR_CODE = 400;

      header['SendBird'] = API_HEADER_PARAM;

      /*********************************************************************************************************************
       * for NODE.js
       ********************************************************************************************************************/
      var _Xhr;
      var _WS;
      try {
        _Xhr = (typeof window === 'undefined') ? require('xhr2') : null;
      } catch (err) {
        _Xhr = null;
      }

      if (_Xhr) {
        var http = require('http');
        var https = require('https');
        var nodejsHttpAgent = new http.Agent({keepAlive: true, keepAliveMsecs: 60000});
        var nodejsHttpsAgent = new https.Agent({keepAlive: true, keepAliveMsecs: 60000});
        var options = {};
        options.httpAgent = nodejsHttpAgent;
        options.httpsAgent = nodejsHttpsAgent;
        _Xhr.nodejsSet(options);
      }

      function _isIE() {
        try {
          if (typeof navigator === 'undefined' || typeof navigator.userAgent === 'undefined') {
            return false;
          } else {
            var myNav = navigator.userAgent.toLowerCase();
            return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
          }
        } catch (err) {
          return false;
        }
      }

      /**************************************************************************************************************
       **************************************************************************************************************/

      var request = _Xhr ? new _Xhr() : new XMLHttpRequest();
      var _IE_version = _isIE();

      if (!("withCredentials" in request) && _IE_version && (_IE_version < 10)) { // IE 9-
        request = new XDomainRequest();
        request.withCredentials = true;

        request.open(method, url);

        for (var i in header) {
          data[i] = header[i];
        }

        request.onload = function () {
          var resp = JSON.parse(request.responseText);
          if (resp.error) {
            cb(null, {
              status: request.status,
              statusText: request.statusText,
            });
          } else {
            cb(resp);
          }
        };

        request.onerror = function () {
          cb(null, {
            status: 404,
            statusText: 'There was a connection error',
          });
        };

      } else {
        try { // IE 10+, safari, chrome, firefox ...
          request = _Xhr ? new _Xhr() : new XMLHttpRequest();
          request.open(method, url);

          request.onload = function () {
            if (request.status >= _AJAX_SUCCESS_CODE && request.status < _AJAX_ERROR_CODE) {
              if (typeof cb == 'function') {
                var resp = request.responseText;
                cb(JSON.parse(resp));
              }
            } else {
              cb(null, {
                status: request.status,
                statusText: request.statusText,
              });
            }
          };

          request.onerror = function () {
            // There was a connection error of some sort
            // errorFunc(404, 'There was a connection error');
            cb(null, {
              status: 404,
              statusText: 'There was a connection error',
            });
          };

        } catch (err) { // IE 9-
          request = new ActiveXObject("Microsoft.XMLHTTP");
          request.open(method, url);

          request.onreadystatechange = function () {
            if (request.readyState == 4) {
              if (request.status >= _AJAX_SUCCESS_CODE && request.status < _AJAX_ERROR_CODE) {
                var resp = request.responseText;
                // successFunc(JSON.parse(resp));
                cb(JSON.parse(resp));
              } else {
                // errorFunc(request.status, request.statusText);
                cb(null, {
                  status: request.status,
                  statusText: request.statusText,
                });
              }
            }
          };
        }

        try {
          request.setRequestHeader('Content-Type', APIClient.MIME_JSON);
          for (var i in header) {
            request.setRequestHeader(i, header[i]);
          }
        } catch (e) {
          // debug.error(e);
          //console.log(e);
        }
      }

      try {
        switch (method) {
          case 'get':
          case 'GET':
            request.send();
            break;
          default:
            request.send(JSON.stringify(data));
        }
      } catch (e) {
        //console.log('request.send() fail');
      }
    };

    this.groupChannelInvite = function (channelUrl, _userIds, cb) {
      var url = APIClient.API_GROUPCHANNELS_CHANNELURL_INVITE.replace('%s', encodeURIComponent(channelUrl));
      var form = {};

      var userIds = [];
      try {
        if (_userIds.constructor.name == 'Array') {
          userIds = _userIds;
        } else {
          userIds.push(_userIds);
        }
      } catch (e) {
        debug.error(e);
        // todo: error message
        cb(null, new SendBirdException('Invalid parameter.', SendBirdError.INVALID_PARAMETER))
      }

      form['user_ids'] = userIds;
      requestPOST(url, form, cb);
    };

    this.groupChannelHide = function (channelUrl, userId, cb) {
      var url = APIClient.API_GROUPCHANNELS_CHANNELURL_HIDE.replace('%s', encodeURIComponent(channelUrl));
      var form = {};
      form['user_id'] = userId;

      requestPUT(url, form, cb);
    };

    this.groupChannelLeave = function (channelUrl, userId, cb) {
      var url = APIClient.API_GROUPCHANNELS_CHANNELURL_LEAVE.replace('%s', encodeURIComponent(channelUrl));
      var form = {};
      form['user_id'] = userId;

      requestPUT(url, form, cb);
    };

    this.groupChannelMarkAsRead = function (channelUrl, userId, ts, cb) {
      var url = APIClient.API_GROUPCHANNELS_CHANNELURL_MESSAGES_MARKASREAD.replace('%s', encodeURIComponent(channelUrl));
      var form = {};
      form['user_id'] = userId;
      form['ts'] = ts;

      requestPUT(url, form, cb);
    };

    this.groupChannelMarkAsReadAll = function (userId, cb) {
      var url = APIClient.API_USERS_USERID_MARKASREADALL.replace('%s', encodeURIComponent(userId));
      var form = {};

      requestPUT(url, form, cb);
    };

    this.messageList = function (isOpenChannel, channelUrl, messageTimestamp, prevLimit, nextLimit, include, reverse, cb) {
      var url;
      if (isOpenChannel) {
        url = String(APIClient.API_OPENCHANNELS_CHANNELURL_MESSAGES.replace('%s', channelUrl));
      } else {
        url = String(APIClient.API_GROUPCHANNELS_CHANNELURL_MESSAGES.replace('%s', channelUrl));
      }

      var params = {};
      params["is_sdk"] = String(true);
      params["message_ts"] = String(messageTimestamp);
      params["prev_limit"] = String(prevLimit);
      params["next_limit"] = String(nextLimit);
      params["include"] = String(include);
      params["reverse"] = String(reverse);

      requestGET(url, params, cb);
    };

    this.login = function (userId, accessToken, cb) {
      var url = APIClient.API_USERS_USERID_LOGIN.replace('%s', encodeURIComponent(userId));
      var form = {};

      form['app_id'] = self.SendBird.getApplicationId();
      if (accessToken) {
        form['access_token'] = accessToken;
      }

      requestPOST(url, form, function (response, error) {
        if (error) {
          cb(null, error);
        } else {
          self.APIClient.sessionKey = response.key;
          cb(response, error);
        }
      });
    };

    this.updateUserInfo = function (userId, nickname, profileUrl, cb) {
      var form = {};
      if (nickname) {
        form['nickname'] = nickname;
      }

      if (profileUrl) {
        form['profile_url'] = profileUrl;
      }

      var url = String(APIClient.API_USERS_USERID).replace('%s', encodeURIComponent(userId));
      requestPUT(url, form, cb);
    };

    this.getGroupChannel = function (channelUrl, member, readReceipt, cb) {
      var url = APIClient.API_GROUPCHANNELS_CHANNELURL.replace('%s', encodeURIComponent(channelUrl));

      var params = {
        member: String(member),
        read_receipt: String(readReceipt)
      };

      requestGET(url, params, cb);
    };

    this.getOpenChannel = function (channelUrl, cb) {
      var url = APIClient.API_OPENCHANNELS_CHANNELURL.replace('%s', encodeURIComponent(channelUrl));
      requestGET(url, cb);
    };

    this.createGroupChannel = function (_userIds, isDistinct, name, coverUrl, data, cb) {
      var url = APIClient.API_GROUPCHANNELS;
      var form = {};
      var userIds = [];

      if (typeof _userIds == 'string') {
        userIds.push(_userIds);
      } else {
        _userIds.forEach(function (userId) {
          //console.log('createGroupChannel: users -', userId);
          userIds.push(userId);
        });
      }

      form['user_ids'] = userIds;
      form['is_distinct'] = isDistinct;

      if (name) {
        form['name'] = name;
      }

      if (coverUrl) {
        form['cover_url'] = coverUrl;
      }

      if (data) {
        form['data'] = data;
      }

      requestPOST(url, form, cb);
    };

    this.createOpenChannel = function (name, coverUrl, data, operatorIds, cb) {
      var url = String(APIClient.API_OPENCHANNELS);
      var form = {};

      if (name) {
        form["name"] = name;
      }

      if (coverUrl) {
        form["cover_url"] = coverUrl;
      }

      if (data) {
        form["data"] = data;
      }

      if (operatorIds) {
        if (operatorIds.constructor.name == 'Array') {
          form["operators"] = operatorIds;
        } else {
          form["operators"] = [operatorIds];
        }
      }

      requestPOST(url, form, cb);
    };

    /***********************************
     Meta Counter
     **********************************/
    this.createMetaCounters = function (isOpenChannel, channelUrl, metaCounterMap, cb) {
      var url;

      if (isOpenChannel) {
        url = APIClient.API_OPENCHANNELS_CHANNELURL_METACOUNTER.replace('%s', encodeURIComponent(channelUrl));
      } else {
        url = APIClient.API_GROUPCHANNELS_CHANNELURL_METACOUNTER.replace('%s', encodeURIComponent(channelUrl));
      }

      var form = {};
      // var metas = {};
      //
      // for (var i in metaCounterMap) {
      //   var item = metaCounterMap[i];
      //   metas[i] = item;
      // }

      form['metacounter'] = metaCounterMap;

      requestPOST(url, form, cb);
    };

    this.updateMetaCounters = function (isOpenChannel, channelUrl, metaCounterMap, upsert, mode, cb) {
      var url;

      if (isOpenChannel) {
        url = APIClient.API_OPENCHANNELS_CHANNELURL_METACOUNTER.replace('%s', encodeURIComponent(channelUrl));
      } else {
        url = APIClient.API_GROUPCHANNELS_CHANNELURL_METACOUNTER.replace('%s', encodeURIComponent(channelUrl));
      }

      var form = {};

      form['metacounter'] = metaCounterMap;
      form['upsert'] = upsert;

      switch (mode) {
        case APIClient.UPDATE_META_COUNTER_MODE_SET:
          form['mode'] = 'set';
          break;
        case APIClient.UPDATE_META_COUNTER_MODE_INC:
          form['mode'] = "increase";
          break;
        case APIClient.UPDATE_META_COUNTER_MODE_DEC:
          form['mode'] = "decrease";
          break;
      }

      requestPUT(url, form, cb);
    };

    this.getAllMetaCounters = function (isOpenChannel, channelUrl, cb) {
      // Pass empty list will returns all meta counters.
      this.getMetaCounters(isOpenChannel, channelUrl, {}, cb);
    };

    this.getMetaCounters = function (isOpenChannel, channelUrl, keys, cb) {
      var url;
      if (isOpenChannel) {
        url = APIClient.API_OPENCHANNELS_CHANNELURL_METACOUNTER.replace('%s', encodeURIComponent(channelUrl));
      } else {
        url = APIClient.API_GROUPCHANNELS_CHANNELURL_METACOUNTER.replace('%s', encodeURIComponent(channelUrl));
      }

      var sb = '';
      for (var i in keys) {
        var key = keys[i];
        sb += ',' + key;
      }
      var joinedKeys = sb;
      var params = {
        'keys': joinedKeys
      };

      requestGET(url, params, cb);
    };

    this.deleteMetaCounter = function (isOpenChannel, channelUrl, key, cb) {
      var url = '';
      if (isOpenChannel) {
        url = APIClient.API_OPENCHANNELS_CHANNELURL_METACOUNTER_KEY.replace('%s', encodeURIComponent(channelUrl)).replace('%s', key);
      } else {
        url = APIClient.API_GROUPCHANNELS_CHANNELURL_METACOUNTER_KEY.replace('%s', encodeURIComponent(channelUrl)).replace('%s', key);
      }

      var form = {};
      requestDELETE(url, form, cb);
    };

    this.deleteAllMetaCounters = function (isOpenChannel, channelUrl, cb) {
      var url = '';
      if (isOpenChannel) {
        url = APIClient.API_OPENCHANNELS_CHANNELURL_METACOUNTER.replace('%s', encodeURIComponent(channelUrl));
      } else {
        url = APIClient.API_GROUPCHANNELS_CHANNELURL_METACOUNTER.replace('%s', encodeURIComponent(channelUrl));
      }

      var form = {};
      requestDELETE(url, form, cb);
    };

    /***********************************
     Meta Data
     **********************************/
    this.createMetaData = function (isOpenChannel, channelUrl, metaDataMap, cb) {
      var url = '';
      if (isOpenChannel) {
        url = APIClient.API_OPENCHANNELS_CHANNELURL_METADATA.replace('%s', encodeURIComponent(channelUrl));
      } else {
        url = APIClient.API_GROUPCHANNELS_CHANNELURL_METADATA.replace('%s', encodeURIComponent(channelUrl));
      }

      var form = {};
      var metas = {};

      for (var i in metaDataMap) {
        var item = metaDataMap[i];
        metas[i] = item;
      }

      form['metadata'] = metas;

      requestPOST(url, form, cb);
    };

    this.updateMetaData = function (isOpenChannel, channelUrl, metaDataMap, upsert, cb) {
      var url = '';
      if (isOpenChannel) {
        url = APIClient.API_OPENCHANNELS_CHANNELURL_METADATA.replace('%s', encodeURIComponent(channelUrl));
      } else {
        url = APIClient.API_GROUPCHANNELS_CHANNELURL_METADATA.replace('%s', encodeURIComponent(channelUrl));
      }

      var form = {};
      var metas = {};

      for (var i in metaDataMap) {
        var item = metaDataMap[i];
        metas[i] = item;
      }
      form['metadata'] = metas;
      form['upsert'] = upsert;

      requestPUT(url, form, cb);
    };

    this.getAllMetaData = function (isOpenChannel, channelUrl, cb) {
      // Pass empty list will returns all meta counters.
      this.getMetaData(isOpenChannel, channelUrl, {}, cb);
    };

    this.getMetaData = function (isOpenChannel, channelUrl, keys, cb) {
      var url = '';
      if (isOpenChannel) {
        url = APIClient.API_OPENCHANNELS_CHANNELURL_METADATA.replace('%s', encodeURIComponent(channelUrl));
      } else {
        url = APIClient.API_GROUPCHANNELS_CHANNELURL_METADATA.replace('%s', encodeURIComponent(channelUrl));
      }

      var sb = '';
      for (var i in keys) {
        var key = keys[i];
        sb += ',' + key;
      }
      var joinedKeys = sb;
      var params = {
        'keys': joinedKeys
      };

      requestGET(url, params, cb);
    };

    this.deleteMetaData = function (isOpenChannel, channelUrl, key, cb) {
      var url = '';
      if (isOpenChannel) {
        url = APIClient.API_OPENCHANNELS_CHANNELURL_METADATA_KEY.replace('%s', encodeURIComponent(channelUrl)).replace('%s', key);
      } else {
        url = APIClient.API_GROUPCHANNELS_CHANNELURL_METADATA_KEY.replace('%s', encodeURIComponent(channelUrl)).replace('%s', key);
      }

      requestDELETE(url, {}, cb);
    };

    this.deleteAllMetaData = function (isOpenChannel, channelUrl, cb) {
      var url = '';
      if (isOpenChannel) {
        url = APIClient.API_OPENCHANNELS_CHANNELURL_METADATA.replace('%s', encodeURIComponent(channelUrl));
      } else {
        url = APIClient.API_GROUPCHANNELS_CHANNELURL_METADATA.replace('%s', encodeURIComponent(channelUrl));
      }

      requestDELETE(url, {}, cb);
    };

    this.loadUserList = function (token, limit, cb) {
      var url = APIClient.API_USERS;
      var params = {
        token: token,
        limit: String(limit)
      };
      requestGET(url, params, cb);
    };

    this.loadBlockedUserList = function (blockerUserId, token, limit, cb) {
      var url = APIClient.API_USERS_USERID_BLOCK.replace('%s', encodeURIComponent(blockerUserId));

      var params = {
        token: token,
        limit: String(limit),
      };
      requestGET(url, params, cb);
    };

    this.loadOpenChannelList = function (token, limit, cb) {
      var url = APIClient.API_OPENCHANNELS;
      var params = {
        token: token,
        limit: String(limit)
      };
      requestGET(url, params, cb);
    };

    this.uploadFile = function (file, cb) {
      requestFILE(APIClient.API_STORAGE_FILE, {}, file, cb);
    };

    this.uploadProfileImage = function (file, cb) {
      requestFILE(APIClient.API_STORAGE_PROFILE, {}, file, cb);
    };

    this.loadUserGroupChannelList = function (userId, token, limit, includeEmpty, order, cb) {
      var url = APIClient.API_GROUPCHANNELS;
      var params = {
        user_id: userId,
        token: token,
        limit: String(limit),
        member: true,
        show_empty: String(includeEmpty),
        order: order
      };

      requestGET(url, params, cb);
    };

    this.loadOpenChannelParticipantList = function (channelUrl, token, limit, cb) {
      var url = APIClient.API_OPENCHANNELS_CHANNELURL_PARTICIPANTS.replace('%s', channelUrl);
      var params = {
        token: token,
        limit: String(limit)
      };

      requestGET(url, params, cb);
    };

    this.loadOpenChannelMutedList = function (channelUrl, token, limit, cb) {
      var url = APIClient.API_OPENCHANNELS_CHANNELURL_MUTE.replace('%s', channelUrl);
      var params = {
        token: token,
        limit: String(limit)
      };

      requestGET(url, params, cb);
    };

    this.loadOpenChannelBanList = function (channelUrl, token, limit, cb) {
      var url = APIClient.API_OPENCHANNELS_CHANNELURL_BAN.replace('%s', channelUrl);
      var params = {
        token: token,
        limit: String(limit)
      };

      requestGET(url, params, cb);
    };

    /***********************************
     GCM Push Token
     **********************************/
    this.registerGCMPushToken = function (userId, token, cb) {
      var url = APIClient.API_USERS_USERID_PUSH_GCM.replace('%s', encodeURIComponent(userId));
      var form = {
        gcm_reg_token: token
      };
      requestPOST(url, form, cb);
    };

    this.unregisterGCMPushToken = function (userId, token, cb) {
      var url = APIClient.API_USERS_USERID_PUSH_GCM_TOKEN.replace('%s', encodeURIComponent(userId)).replace('%s', encodeURIComponent(token));
      requestDELETE(url, cb);
    };

    this.unregisterGCMPushTokenAll = function (userId, cb) {
      var url = APIClient.API_USERS_USERID_PUSH_GCM.replace('%s', encodeURIComponent(userId));
      requestDELETE(url, cb);
    };

    /***********************************
     APNS Push Token
     **********************************/
    this.registerAPNSPushToken = function (userId, token, cb) {
      var url = APIClient.API_USERS_USERID_PUSH_APNS.replace('%s', encodeURIComponent(userId));
      var form = {
        gcm_reg_token: token
      };
      requestPOST(url, form, cb);
    };

    this.unregisterAPNSPushToken = function (userId, token, cb) {
      var url = APIClient.API_USERS_USERID_PUSH_APNS_TOKEN.replace('%s', encodeURIComponent(userId)).replace('%s', encodeURIComponent(token));
      requestPUT(url, cb);
    };

    this.unregisterAPNSPushTokenAll = function (userId, token, cb) {
      var url = APIClient.API_USERS_USERID_PUSH_APNS.replace('%s', encodeURIComponent(userId));
      requestDELETE(url, cb);
    };

    this.blockUser = function(blockerUserId, blockeeUserId, cb) {
      var url = APIClient.API_USERS_USERID_BLOCK.replace('%s', encodeURIComponent(blockerUserId));
      var params = {
        target_id: blockeeUserId
      };

      requestPOST(url, params, cb);
    };

    this.unblockUser = function(blockerUserId, blockeeUserId, cb) {
      var url = APIClient.API_USERS_USERID_BLOCK_TARGETID.replace('%s', encodeURIComponent(blockerUserId)).replace('%s', encodeURIComponent(blockeeUserId));
      requestPOST(url, {}, cb);
    };

    this.banUser = function(channelUrl, userId, description, seconds, cb) {
      var url = APIClient.API_OPENCHANNELS_CHANNELURL_BAN.replace('%s', encodeURIComponent(channelUrl));
      var params = {
        user_id: userId
      };
      if (description) {
        params['description'] = description;
      }
      params['seconds'] = String(seconds);
      requestPOST(url, params, cb);
    };

    this.unbanUser = function(channelUrl, userId, cb) {
      var url = APIClient.API_OPENCHANNELS_CHANNELURL_BAN_USERID.replace('%s', encodeURIComponent(channelUrl)).replace('%s', encodeURIComponent(userId));
      requestDELETE(url, {}, cb);
    };

    this.muteUser = function(channelUrl, userId, cb) {
      var url = APIClient.API_OPENCHANNELS_CHANNELURL_MUTE.replace('%s', encodeURIComponent(channelUrl));
      var params = {
        user_id: userId
      };

      requestPOST(url, params, cb);
    };

    this.unmuteUser = function(channelUrl, userId, cb) {
      var url = APIClient.API_OPENCHANNELS_CHANNELURL_MUTE_USERID.replace('%s', encodeURIComponent(channelUrl)).replace('%s', encodeURIComponent(userId));
      requestDELETE(url, {}, cb);
    };

    this.deleteMessage = function (isOpenChannel, channelUrl, messageId, cb) {
      var url = '';
      if (isOpenChannel) {
        url = APIClient.API_OPENCHANNELS_CHANNELURL_MESSAGES_MESSAGEID.replace('%s', encodeURIComponent(channelUrl)).replace('%s', encodeURIComponent(messageId));
      } else {
        url = APIClient.API_GROUPCHANNELS_CHANNELURL_MESSAGES_MESSAGEID.replace('%s', encodeURIComponent(channelUrl)).replace('%s', encodeURIComponent(messageId));
      }

      requestDELETE(url, {}, cb);
    };

    return this;
  };


  /***********************************
   * BaseChannel Class Static
   ***********************************/
  BaseChannel.CHANNEL_TYPE_OPEN = 'open';
  BaseChannel.CHANNEL_TYPE_GROUP = 'group';
  BaseChannel.CHANNEL_TYPE_BASE = 'base';

  /***********************************
   * BaseChannel Class
   ***********************************/
  function BaseChannel(jsonObject) {
    var sInstance = this;
    this.___update = function (jsonObject) {
      this.url = String(jsonObject['channel_url']);
      this.name = String(jsonObject['name']);
      this.createdAt = jsonObject.hasOwnProperty('created_at') ? jsonObject['created_at'] * 1000 : 0;
      this.coverUrl = String(jsonObject['cover_url']);
      this.data = String(jsonObject['data']);
    };

    this.isGroupChannel = function () {
      return this.channelType == BaseChannel.CHANNEL_TYPE_GROUP;
    };

    this.isOpenChannel = function () {
      return this.channelType == BaseChannel.CHANNEL_TYPE_OPEN;
    };


    /**
     * Create previous message list query for this channel.
     * @return PreviousMessageListQuery
     */
    this.createPreviousMessageListQuery = function () {
      return new PreviousMessageListQuery(this);
    };

    /**
     * Create message list query for this channel.
     * @return MessageListQuery
     */
    this.createMessageListQuery = function () {
      return new MessageListQuery(this);
    };

    /**
     * Send a file with given file information.
     * @return Temporary FileMessage instance with requestId.
     */

    this.sendFileMessage = function () {
      //console.log(arguments.length);
      switch(arguments.length) {
        case 2:
          var file = arguments[0];
          var cb = arguments[1];
          if (typeof file == 'string') {
            var name = '';
            var type = '';
            var size = '';
          } else {
            var name = file['name'];
            var type = file['type'];
            var size = file['size'];
          }
          break;
        case 3:
          var file = arguments[0];
          var data = arguments[1];
          var cb = arguments[2];

          if (typeof file == 'string') {
            var name = '';
            var type = '';
            var size = '';
          } else {
            var name = file['name'];
            var type = file['type'];
            var size = file['size'];
          }
          break;
        case 6:
          var file = arguments[0];
          var name = arguments[1];
          var type = arguments[2];
          var size = arguments[3];
          var data = arguments[4];
          var cb = arguments[5];
          break;
      }

      var channelUrl = sInstance.url;
      var sendFileCommand = function (_channelUrl, _fileUrl, _name, _type, _size, _data, _cb) {
        var reqId = Command.generateRequestId();
        var cmd = Command.bFile(reqId, _channelUrl, _fileUrl, _name, _type, _size, _data);

        self.SendBird.sendCommand(cmd, function (ackedCommand, error) {
          if (error) {
            if (_cb) {
              _cb(null, error);
            }
            return;
          }

          var fileMessage = new FileMessage(ackedCommand.getJsonElement());

          if (_cb) {
            // //console.log('sendCommand Result', fileMessage);
            _cb(fileMessage);
          }
        });
      };

      if (typeof file == 'string') {
        var fileUrl = file;
        sendFileCommand(channelUrl, fileUrl, name, type, size, data, cb);
      } else {
        self.APIClient.uploadFile(file, function (response, error) {
          if (error) {
            if (cb) {
              cb(null, error);
            }
            return;
          }

          var result = JSON.parse(response);
          var fileUrl = result['url'];

          sendFileCommand(channelUrl, fileUrl, name, type, size, data, cb);
        });
      }
    };

    this.sendUserMessage = function (message, data, cb) {
      if (typeof data == 'function') {
        cb = data;
        data = null;
      }

      var cmd = Command.bMessage(this.url, message, data, []);
      var msgObj = UserMessage.build(cmd.requestId, 0, self.SendBird.getInstance().currentUser, this, message, data, new Date().getTime());
      var msg = new UserMessage(msgObj);

      self.SendBird.getInstance().sendCommand(cmd, function (ackedCommand, error) {
        if (error) {
          //console.log('sendUserMessage error', error.code);
          if (cb) {
            cb(null, error);
          }
          return;
        }
        var userMessage = new UserMessage(ackedCommand.getJsonElement());

        if (cb) {
          cb(userMessage)
        }
      });
      return msg;
    };


    /**
     *
     * MetaCounter
     *
     */
    this.createMetaCounters = function (metaCounterMap, cb) {
      APIClient.getInstance().createMetaCounters(this.isOpenChannel(), this.url, metaCounterMap, function (response, error) {
        if (error) {
          cb(null, error);
          return;
        }

        if (cb) {
          cb(response);
        }
      });
    };

    this.updateMetaCounters = function (metaCounterMap, upsert, cb) {
      APIClient.getInstance().updateMetaCounters(this.isOpenChannel(), this.url, metaCounterMap, upsert, self.APIClient.UPDATE_META_COUNTER_MODE_SET, function (response, error) {
        if (error) {
          cb(null, error);
          return;
        }

        if (cb) {
          cb(response);
        }
      });
    };

    /**
     * Increase meta counters. Atomic operation.
     * @param metaCounterMap
     * @param cb
     */
    this.increaseMetaCounters = function (metaCounterMap, cb) {
      APIClient.getInstance().updateMetaCounters(this.isOpenChannel(), this.url, metaCounterMap, false, APIClient.UPDATE_META_COUNTER_MODE_INC, function (response, error) {
        if (error) {
          cb(null, error);
          return;
        }

        if (cb) {
          cb(response);
        }
      });
    };

    /**
     * Decrease meta counters. Atomic operation.
     * @param metaCounterMap
     * @param cb
     */
    this.decreaseMetaCounters = function (metaCounterMap, cb) {
      APIClient.getInstance().updateMetaCounters(this.isOpenChannel(), this.url, metaCounterMap, false, APIClient.UPDATE_META_COUNTER_MODE_DEC, function (response, error) {
        if (error) {
          cb(null, error);
          return;
        }

        var jsonObject = response;
        var metas = {};

        for (var i in jsonObject) {
          var item = jsonObject[i];

          // TODO: check item!
          // //console.log(item);

          // result[item.getKey()] = item.getValue();
          metas[i] = item;
        }

        if (typeof cb == 'function') {
          cb(metas, null);
        }
      });
    };

    /**
     * Get meta counters
     * @param keys
     * @param cb
     */
    this.getMetaCounters = function (keys, cb) {
      APIClient.getInstance().getMetaCounters(this.isOpenChannel(), this.url, keys, function (response, error) {
        if (error) {
          cb(null, error);
          return;
        }

        if (typeof cb == 'function') {
          cb(response, null);
        }

      });
    };

    /**
     * Get all meta counters
     * @param cb
     */
    this.getAllMetaCounters = function (cb) {
      APIClient.getInstance().getAllMetaCounters(this.isOpenChannel(), this.url, function (response, error) {
        if (error) {
          cb(null, error);
          return;
        }

        if (typeof cb == 'function') {
          cb(response, null);
        }
      });
    };

    /**
     * Delete a meta counter
     * @param key
     * @param cb
     */
    this.deleteMetaCounter = function (key, cb) {
      APIClient.getInstance().deleteMetaCounter(this.isOpenChannel(), this.url, key, function (response, error) {
        if (error) {
          cb(null, error);
          return;
        }

        if (cb) {
          cb(response, null);
        }
      });
    };

    /**
     * Delete all meta counters
     * @param key
     * @param cb
     */
    this.deleteAllMetaCounters = function (cb) {
      APIClient.getInstance().deleteAllMetaCounters(this.isOpenChannel(), this.url, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        if (cb) {
          cb(response, null);
        }
      });
    };

    /**
     *
     * MetaData
     *
     */

    /**
     * Create meta data
     * @param metaDataMap
     * @param cb
     */
    this.createMetaData = function (metaDataMap, cb) {
      APIClient.getInstance().createMetaData(this.isOpenChannel(), this.url, metaDataMap, function (response, error) {
        if (error) {
          cb(null, error);
          return;
        }

        if (cb) {
          cb(response, null);
        }
      });
    };

    /**
     * Update meta data
     * @param metaDataMap
     * @param upsert
     * @param cb
     */
    this.updateMetaData = function (metaDataMap, upsert, cb) {
      APIClient.getInstance().updateMetaData(this.isOpenChannel(), this.url, metaDataMap, upsert, function (response, error) {
        if (error) {
          cb(null, error);
          return;
        }

        if (cb) {
          cb(response, null);
        }
      });
    };

    /**
     * Get meta data
     * @param keys
     * @param cb
     */
    this.getMetaData = function (keys, cb) {
      APIClient.getInstance().getMetaData(this.isOpenChannel(), this.url, keys, function (response, error) {
        if (error) {
          cb(null, error);
          return;
        }

        if (cb) {
          cb(response, null);
        }
      });
    };

    /**
     * Get all meta data
     * @param cb
     */
    this.getAllMetaData = function (cb) {
      APIClient.getInstance().getAllMetaData(this.isOpenChannel(), this.url, function (response, error) {
        if (error) {
          cb(null, error);
          return;
        }

        if (cb) {
          cb(response, null);
        }
      });
    };

    /**
     * Delete a meta data
     * @param cb
     */
    this.deleteMetaData = function (key, cb) {
      APIClient.getInstance().deleteMetaData(this.isOpenChannel(), this.url, key, function (response, error) {
        if (error) {
          cb(null, error);
          return;
        }

        if (cb) {
          cb(response, null);
        }
      });
    };

    /**
     * Delete all meta data
     * @param cb
     */
    this.deleteAllMetaData = function (cb) {
      APIClient.getInstance().deleteAllMetaData(this.isOpenChannel(), this.url, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        if (cb) {
          cb(response, null);
        }
      });
    };

    /**
     * Delete a message
     *
     * @param message
     * @param handler
     */
    this.deleteMessage = function(message, cb) {
      if (!message) {
        if (cb) {
          cb(null, new SendBirdException("Invalid arguments.", SendBirdError.INVALID_PARAMETER));
        }
        return;
      }

      APIClient.getInstance().deleteMessage(this.isOpenChannel(), this.url, message.messageId, function(response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        if (cb) {
          cb();
        }
      });
    };


    /***********************************
     * Constructor
     */
    this.channelType = BaseChannel.CHANNEL_TYPE_BASE;

    this.url;
    this.name;
    this.coverUrl;

    this.createdAt;
    this.data;

    if (!jsonObject) {
      return this;
    }

    this.___update(jsonObject);
    return this;
  };


  /***********************************
   * BaseMessage Class Static Method
   ***********************************/
  BaseMessage.build = function (jsonObject, channel) {
    switch (jsonObject['type']) {
      case "MESG":
        var user = new User(jsonObject["user"]);
        var msgId = parseInt(jsonObject["message_id"]);
        var message = String(jsonObject["message"]);
        var data = String(jsonObject["data"]);
        var createdAt = parseInt(jsonObject["created_at"]);

        return new UserMessage(UserMessage.build("", msgId, user, channel, message, data, createdAt));
        break;
      case "FILE":
        var user = new User(jsonObject["user"]);
        var msgId = parseInt(jsonObject["message_id"]);
        var message = String(jsonObject["message"]);
        var data = String(jsonObject["data"]);
        var createdAt = parseInt(jsonObject["created_at"]);

        var file = jsonObject["file"];
        var url = String(file["url"]);
        var name = String(file["name"]);
        var fileType = String(file["type"]);
        var size = parseInt(file["size"]);

        return new FileMessage(FileMessage.build("", msgId, user, channel, url, name, fileType, size, data, createdAt));
        break;
      case "BRDM":
      case "ADMM":
        var msgId = parseInt(jsonObject["message_id"]);
        var message = String(jsonObject["message"]);
        var data = String(jsonObject["data"]);
        var createdAt = parseInt(jsonObject["created_at"]);

        return new AdminMessage(AdminMessage.build(msgId, channel, message, data, createdAt));
        break;
      default:
      // //console.log('BaseMessage.build, not found case', jsonObject);
      //console.log('Unknown message type:' + jsonObject['type']);
    }

    return null;
  };

  BaseMessage.MESSAGE_TYPE_BASE = 'base';
  BaseMessage.MESSAGE_TYPE_ADMIN = 'admin';
  BaseMessage.MESSAGE_TYPE_USER = 'user';
  BaseMessage.MESSAGE_TYPE_FILE = 'file';


  /***********************************
   * BaseMessage Class
   ***********************************/
  function BaseMessage(jsonObject) {
    this.isOpenChannel = function () {
      return this.channelType == BaseChannel.CHANNEL_TYPE_OPEN;
    };

    this.isGroupChannel = function () {
      // //console.log('CHANNELTYPE:', channelType);
      return this.channelType == BaseChannel.CHANNEL_TYPE_GROUP;
    };


    this.messageType;
    this.messageId;
    this.channelUrl;
    this.createdAt;
    this.channelType;

    if (!jsonObject) {
      return this;
    }

    /*************************
     * Constructor
     */
    this.messageType = BaseMessage.MESSAGE_TYPE_BASE;

    this.messageId = jsonObject.hasOwnProperty('msg_id') ? parseInt(jsonObject['msg_id']) : 0;
    this.channelUrl = jsonObject.hasOwnProperty('channel_url') ? String(jsonObject['channel_url']) : '';
    this.createdAt = jsonObject.hasOwnProperty('ts') ? parseInt(jsonObject['ts']) : 0;
    this.channelType = jsonObject.hasOwnProperty('channel_type') ? String(jsonObject['channel_type']) : BaseChannel.CHANNEL_TYPE_GROUP;

    this.isUserMessage = function () {
      if (this.messageType == BaseMessage.MESSAGE_TYPE_USER) {
        return true;
      } else {
        return false;
      }
    };

    this.isAdminMessage = function () {
      if (this.messageType == BaseMessage.MESSAGE_TYPE_ADMIN) {
        return true;
      } else {
        return false;
      }
    };

    this.isFileMessage = function () {
      if (this.messageType == BaseMessage.MESSAGE_TYPE_FILE) {
        return true;
      } else {
        return false;
      }
    };
  };


  /***********************************
   * ChannelEvent Class Static
   ***********************************/

  /**
   * Unknown Category.
   */
  ChannelEvent.CATEGORY_NONE = 0;

  ChannelEvent.CATEGORY_CHANNEL_ENTER = 10102;
  ChannelEvent.CATEGORY_CHANNEL_EXIT = 10103;

  ChannelEvent.CATEGORY_USER_CHANNEL_MUTE = 10201;
  ChannelEvent.CATEGORY_USER_CHANNEL_UNMUTE = 10200;

  ChannelEvent.CATEGORY_USER_CHANNEL_BAN = 10601;
  ChannelEvent.CATEGORY_USER_CHANNEL_UNBAN = 10600;

  ChannelEvent.CATEGORY_CHANNEL_FREEZE = 10701;
  ChannelEvent.CATEGORY_CHANNEL_UNFREEZE = 10700;

  ChannelEvent.CATEGORY_TYPING_START = 10900;
  ChannelEvent.CATEGORY_TYPING_END = 10901;

  ChannelEvent.CATEGORY_CHANNEL_JOIN = 10000;
  ChannelEvent.CATEGORY_CHANNEL_LEAVE = 10001;

  ChannelEvent.CATEGORY_CHANNEL_PROP_CHANGED = 11000;
  ChannelEvent.CATEGORY_CHANNEL_DELETED = 12000;

  /***********************************
   * ChannelEvent Class
   ***********************************/
  function ChannelEvent(jsonObject) {
    this.isGroupChannel = function () {
      return this.channelType == BaseChannel.CHANNEL_TYPE_GROUP
    };
    this.isOpenChannel = function () {
      return this.channelType == BaseChannel.CHANNEL_TYPE_OPEN
    };

    if (!jsonObject) {
      return this;
    }

    /*************************************
     * Constructor of ChannelEvent
     */
    this.category = jsonObject.hasOwnProperty('cat') ? parseInt(jsonObject['cat']) : 0;
    this.data = jsonObject.hasOwnProperty('data') ? jsonObject['data'] : null;
    this.channelUrl = jsonObject.hasOwnProperty('channel_url') ? String(jsonObject['channel_url']) : '';
    this.channelType = jsonObject.hasOwnProperty('channel_type') ? String(jsonObject['channel_type']) : BaseChannel.CHANNEL_TYPE_GROUP;

    return this;
  };


  /***********************************
   * Command Class Static Method
   ***********************************/
  Command.bMessage = function (channelUrl, message, data, tempId, mentionedUserIds) {
    var obj = {};
    obj['channel_url'] = channelUrl;
    obj['message'] = message;
    obj['data'] = data;
    obj['mentioned'] = [];

    for (var i in mentionedUserIds) {
      var item = mentionedUserIds[i];
      obj['mentioned'].push(String(item));
    }

    return new Command("MESG", obj);
  };

  Command.bTypeStart = function (channelUrl, time) {
    var obj = {};
    obj['channel_url'] = channelUrl;
    obj['time'] = time;
    return new Command("TPST", obj);
  };

  Command.bTypeEnd = function (channelUrl, time) {
    var obj = {};
    obj['channel_url'] = channelUrl;
    obj['time'] = time;
    return new Command("TPEN", obj);
  };

  Command.bFile = function (requestId, channelUrl, url, name, type, size, data) {
    var obj = {};
    obj["channel_url"] = channelUrl;
    obj["url"] = url;
    obj["name"] = name;
    obj["type"] = type;
    obj["size"] = size;
    obj["custom"] = data;
    return new Command("FILE", obj, requestId);
  }

  Command.bPing = function () {
    var obj = {};
    obj['id'] = new Date().getTime();
    return new Command("PING", obj);
  };

  Command.bEnter = function (channelUrl) {
    var obj = {};
    obj['channel_url'] = channelUrl;
    return new Command("ENTR", obj);
  };

  Command.bExit = function (channelUrl) {
    var obj = {};
    obj['channel_url'] = channelUrl;
    return new Command("EXIT", obj);
  };

  Command.requestIdSeed = new Date().getTime();
  Command.generateRequestId = function () {
    Command.requestIdSeed++;
    return String(Command.requestIdSeed);
  };


  /***********************************
   * Command Class
   ***********************************/
  function Command(_command, _payload, _requestId) {

    this.isAckRequired = function () {
      return this.command == 'MESG' || this.command == 'FILE' || this.command == 'ENTR' || this.command == 'EXIT';
    };

    this.encode = function () {
      return this.command + this.payload + '\n';
    };

    var decode = function (cmd) {
      cmd = cmd.trim();
      this.command = cmd.substring(0, 4);
      this.payload = cmd.substring(4);
    };

    this.getJsonElement = function () {
      return JSON.parse(this.payload);
    };

    this.isRequestIdCommand = function () {
      return this.isAckRequired() || this.command == "EROR";
    };

    this.command;
    this.payload;
    this.requestId;


    if (arguments.length == 0) {
      return this;
    }
    /****
     * Constructor
     */
    var reqId;
    switch (arguments.length) {
      case 1:
        var data = arguments[0];
        if (!data || data.length <= 4) {
          this.command = "NOOP";
          this.payload = "{}";
          return;
        }

        data = data.trim();
        this.command = data.substring(0, 4);
        this.payload = data.substring(4);

        if (this.isRequestIdCommand()) {
          var obj = this.getJsonElement();
          if (obj) {
            this.requestId = obj.hasOwnProperty('req_id') ? obj['req_id'] : "";
          }
        }

        break;
      case 3:
        reqId = arguments[2];
      case 2:
        var command = arguments[0];
        var payload = arguments[1];
        reqId = reqId ? reqId : "";

        this.command = command;
        this.requestId = reqId;

        if (!this.requestId) {
          if (this.isRequestIdCommand()) {
            this.requestId = Command.generateRequestId();
          }
        }

        payload['req_id'] = this.requestId;
        this.payload = JSON.stringify(payload);
        break;
    }

    return this;
  };


  /***********************************
   * FileMessage Class Static
   ***********************************/
  FileMessage.build = function (requestId, msgId, user, channel, url, name, type, size, data, createdAt) {
    var obj = {};
    obj["req_id"] = requestId;
    obj["message_id"] = msgId;
    obj["channel_url"] = channel.url;
    obj["channel_type"] = channel.channelType == BaseChannel.CHANNEL_TYPE_OPEN ? BaseChannel.CHANNEL_TYPE_OPEN : BaseChannel.CHANNEL_TYPE_GROUP;
    obj["ts"] = createdAt;

    obj["url"] = url;
    obj["name"] = name;
    obj["type"] = type;
    obj["size"] = size;
    obj["custom"] = data;

    var userObj = {};
    userObj["user_id"] = user.userId;
    userObj["nickname"] = user.nickname;
    userObj["profile_url"] = user.profileUrl;

    obj["user"] = userObj;
    return obj;
  };

  /***********************************
   * FileMessage Class
   ***********************************/
  function FileMessage(jsonObject) {
    var childBase = new BaseMessage(jsonObject);
    childBase.messageType = BaseMessage.MESSAGE_TYPE_FILE;

    childBase.sender;
    childBase.url;
    childBase.name;
    childBase.size;
    childBase.type;
    childBase.data;

    childBase.reqId;

    /*********************************
     * Constructor
     */
    if (!jsonObject) {
      return childBase;
    }

    childBase.sender = new User(jsonObject['user']);
    childBase.url = String(jsonObject['url']);
    childBase.name = jsonObject.hasOwnProperty('name') ? jsonObject['name'] : "File";
    childBase.size = parseInt(jsonObject['size']);
    childBase.type = String(jsonObject['type']);
    childBase.data = String(jsonObject['custom']);

    childBase.reqId = jsonObject.hasOwnProperty('req_id') ? String(jsonObject['req_id']) : '';

    return childBase;
  };


  /***********************************
   * GroupChannel Class Static Method
   ***********************************/

  /**
   * Create GroupChannelListQuery which returns my group channels.
   * @return GroupChannelListQuery
   */
  GroupChannel.createMyGroupChannelListQuery = function () {
    return new GroupChannelListQuery(self.SendBird.currentUser);
  };

  /**
   * Create group channel with given users.
   * @param users
   * @param isDistinct
   * @param name
   * @param coverUrl
   * @param data
   * @param handler
   */
  GroupChannel.createChannel = function () {
    switch (arguments.length) {
      case 3:
        GroupChannel._createChannel(arguments[0], arguments[1], null, null, null, arguments[2]);
        break;
      case 6:
        GroupChannel._createChannel(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        break;
    }
  };

  GroupChannel._createChannel = function (users, isDistinct, name, coverUrl, data, cb) {
    var userIds = [];
    users.forEach(function (user) {
      userIds.push(user.userId);
    });

    switch (arguments.length) {
      case 3:
        GroupChannel.createChannelWithUserIds(userIds, isDistinct, cb);
        break;
      case 6:
        GroupChannel.createChannelWithUserIds(userIds, isDistinct, name, coverUrl, data, cb);
        break;
    }
  };

  GroupChannel.createChannelWithUserIds = function () {
    switch (arguments.length) {
      case 3:
        GroupChannel._createChannelWithUserIds(arguments[0], arguments[1], null, null, null, arguments[2]);
        break;
      case 6:
        GroupChannel._createChannelWithUserIds(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        break;
    }
  };

  GroupChannel._createChannelWithUserIds = function (_userIds, isDistinct, name, coverUrl, data, cb) {
    // Add myself and remove duplicates
    var userIdSet = _userIds.filter(function (elem, index, self) {
      return index == self.indexOf(elem);
    });

    var me = self.SendBird.currentUser;
    userIdSet.push(me.userId);

    var userIds = userIdSet;

    APIClient.getInstance().createGroupChannel(userIds, isDistinct, name, coverUrl, data, function (response, error) {
      if (error) {
        if (cb) {
          cb(null, error);
        }
        return;
      }

      var channel = new GroupChannel(response);
      GroupChannel.cachedChannels[channel.url] = channel;

      if (cb) {
        cb(channel, null);
      }
    });
  };

  GroupChannel.cachedChannels = {};
  // GroupChannel.cachedReadReceiptStatus = {};
  GroupChannel.clearCache = function () {
    GroupChannel.cachedChannels = {};
    // GroupChannel.cachedReadReceiptStatus = {};
  };

  GroupChannel.getChannelWithoutCache = function (channelUrl, cb) {
    APIClient.getInstance().getGroupChannel(channelUrl, true, true, function (response, error) {
      if (error) {
        if (cb) {
          cb(null, error);
        }
        return;
      }

      GroupChannel.__upsert(response);

      if (cb) {
        cb(GroupChannel.cachedChannels[channelUrl], null);
      }
    });
  };

  /**
   * Get a group channel with given channel url.
   * @param channelUrl
   * @param handler
   */
  GroupChannel.getChannel = function (channelUrl, cb) {
    if (GroupChannel.cachedChannels.hasOwnProperty(channelUrl)) {
      if (cb) {
        cb(GroupChannel.cachedChannels[channelUrl], null);
        return;
      }
    } else {
      GroupChannel.getChannelWithoutCache(channelUrl, cb);
    }
  };

  GroupChannel.__upsert = function (jsonObject) {
    var newChannel = new GroupChannel(jsonObject);

    if (GroupChannel.cachedChannels.hasOwnProperty(newChannel.url)) {
      GroupChannel.cachedChannels[newChannel.url].__update(jsonObject);
    } else {
      GroupChannel.cachedChannels[newChannel.url] = newChannel;
    }

    // Do not return the newChannel. It will break single instance restriction.
    return GroupChannel.cachedChannels[newChannel.url];
  };


  GroupChannel.markAsReadAllLastSentAt;
  /**
   * Send mark as read to all group channels.
   * This method has rate limit. You can send one request per second.
   * It returns SendBirdException if you exceed the rate limit.
   * @param handler
   */
  GroupChannel.markAsReadAll = function (cb) {
    var now = new Date().getTime();
    if (now - GroupChannel.markAsReadAllLastSentAt < 1000) {
      if (cb) {
        cb(new SendBirdException("MarkAsRead rate limit exceeded.", SendBirdError.MARK_AS_READ_RATE_LIMIT_EXCEEDED));
      }
      return;
    }

    GroupChannel.markAsReadAllLastSentAt = now;
    APIClient.getInstance().groupChannelMarkAsReadAll(self.SendBird.currentUser.userId, function (response, error) {
      if (error) {
        if (cb) {
          cb(error);
        }
        return;
      }

      for (var i in GroupChannel.cachedChannels) {
        GroupChannel.cachedChannels[i].unreadMessageCount = 0;
      }

      if (cb) {
        cb(null);
      }
    });
  };


  /***********************************
   * GroupChannel Class
   ***********************************/
  function GroupChannel(jsonObject) {
    var childBase = new BaseChannel(jsonObject);
    childBase.channelType = BaseChannel.CHANNEL_TYPE_GROUP;

    var cachedTypingStatus = {};

    var startTypingLastSentAt;
    var endTypingLastSentAt;
    var markAsReadLastSentAt;
    var markAsReadScheduled = false;

    childBase.isDistinct;
    childBase.unreadMessageCount = 0;
    childBase.members = [];
    childBase.memberMap = {};
    childBase.lastMessage;
    childBase.memberCount;
    childBase.cachedReadReceiptStatus = {};

    childBase.refresh = function (cb) {
      GroupChannel.getChannelWithoutCache(childBase.url, function (channel, error) {
        if (error) {
          if (cb) {
            cb(null, error)
          }
          return;
        }

        if (cb) {
          cb();
        }
      });
    };

    childBase.__update = function (jsonObject) {
      childBase.___update(jsonObject);
      childBase.__parse(jsonObject);
    };

    childBase.__parse = function (jsonObject) {
      childBase.isDistinct = jsonObject["is_distinct"] ? true : false;
      childBase.unreadMessageCount = parseInt(jsonObject["unread_message_count"]);

      if (jsonObject.hasOwnProperty("read_receipt")) {
        childBase.cachedReadReceiptStatus = {};

        for (var key in jsonObject['read_receipt']) {
          var value = jsonObject['read_receipt'][key];
          childBase.updateReadReceipt(key, parseInt(value));
        }
      }

      if (jsonObject.hasOwnProperty("members")) {
        childBase.members = [];
        childBase.memberMap = {};

        var objMembers = jsonObject["members"];
        objMembers.forEach(function (member) {
          // //console.log('each member:', member);

          var user = new User(member);
          childBase.members.push(user);
          childBase.memberMap[user.userId] = user;
        });

        childBase.memberCount = childBase.members.length;
      }

      if (jsonObject.hasOwnProperty("member_count")) {
        childBase.memberCount = parseInt(jsonObject["member_count"]);
      }

      if (jsonObject.hasOwnProperty("last_message") && typeof jsonObject["last_message"] == 'object' && jsonObject['last_message']) {
        childBase.lastMessage = BaseMessage.build(jsonObject["last_message"], childBase);
      } else {
        childBase.lastMessage = null;
      }
    };


    var userToIds = function (userId) {
      if (userId instanceof User) {
        var userIds = [];
        userIds.push(userId.userId);
        return userIds;
      }

      if (Array.isArray(userId)) {
        var userIds = [];
        userId.forEach(function (user) {
          if (user instanceof User) {
            userIds.push(user.userId);
          }

          if (parseInt(user) > 0) {
            userIds.push(user);
          }
        });
        return userIds;
      }

      if (parseInt(userId) > 0) {
        var userIds = [];
        userIds.push(userId);
        return userIds;
      }
    };

    childBase.invite = function (_users, cb) {
      var userIds = userToIds(_users);
      childBase.inviteWithUserIds(userIds, cb);
    };

    childBase.inviteWithUserIds = function (userIds, cb) {
      APIClient.getInstance().groupChannelInvite(childBase.url, userIds, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        GroupChannel.__upsert(response);

        if (cb) {
          cb(null);
        }
      });
    };

    childBase.hide = function (cb) {
      APIClient.getInstance().groupChannelHide(childBase.url, self.SendBird.currentUser.userId, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        if (cb) {
          cb(response);
        }
      });
    };

    childBase.leave = function (cb) {
      APIClient.getInstance().groupChannelLeave(childBase.url, self.SendBird.currentUser.userId, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        // if (GroupChannel.cachedChannels.hasOwnProperty(childBase.url)) {
        //   delete(GroupChannel.cachedChannels[childBase.url]);
        // }

        if (cb) {
          cb();
        }
      });
    };

    /**
     * Send mark as read to this channel
     * This method has rate limit. You can send one request per second. The limit is considered on per-channel basis.
     * It returns SendBirdException if you exceed the rate limit.
     * @param handler
     */
    childBase.markAsRead = function (cb) {
      if (!cb) {
        markAsReadScheduled = true;
        return;
      }

      // var now = new Date().getTime();
      // if (now - markAsReadLastSentAt < 1000) {
      //   if (cb) {
      //     cb(new SendBirdException("MarkAsRead rate limit exceeded.", SendBirdError.MARK_AS_READ_RATE_LIMIT_EXCEEDED));
      //   }
      //   return;
      // }
      //
      // markAsReadLastSentAt = now;
      // sendMarkAsRead(now, cb);
    };

    childBase.fireMarkAsRead = function () {
      // //console.log('fireMarkAsRead');
      if (markAsReadScheduled) {
        markAsReadScheduled = false;
        debug.log('fireMarkAsRead scheduled, sendMarkAsRead()');
        sendMarkAsRead(function (response, error) {
          if (error) {
            //console.log(error);
            return;
          }
        });
      }
    };

    var sendMarkAsRead = function (timestamp, cb) {
      if (!self.SendBird.currentUser) {
        cb(null, new SendBirdException("Connection must be made before you mark as read.", SendBirdError.CONNECTION_REQUIRED));
        return;
      }

      APIClient.getInstance().groupChannelMarkAsRead(childBase.url, self.SendBird.currentUser.userId, timestamp, function (response, error) {
        if (error) {
          if (cb) {
            cb(error);
          }
          return;
        }

        childBase.unreadMessageCount = 0;

        if (cb) {
          cb();
        }
      });
    };

    /**
     * Returns how many members haven't been read the given message.
     * @param message The message
     * @return Number of unread member count. Zero if all members read the message.
     */
    childBase.getReadReceipt = function (message) {
      if (!(message instanceof BaseMessage)) {
        debug.error('message is not BaseMessage instance');
      }

      if (message.messageType == message.MESSAGE_TYPE_ADMIN) {
        return 0;
      }

      var me = self.SendBird.currentUser;

      var unreadMemberCount = 0;
      var createdAt = message.createdAt;
      var members = childBase.members;
      var key;
      var value;

      // console.log('cachedReadReceiptStatus ###', childBase.cachedReadReceiptStatus);

      for (var i in members) {
        var member = members[i];
        var key = member.userId;

        if (me.userId == key) {
          continue;
        }

        var value = childBase.cachedReadReceiptStatus[key];

        if (value < createdAt) {
          unreadMemberCount++;
        }
      }
      return unreadMemberCount;
    };

    childBase.updateReadReceipt = function (userId, timestamp) {

      // console.log('## RR UPDATE: ', userId, timestamp);
      // var key = genReadReceiptKey(userId);
      var key = userId;
      var value = childBase.cachedReadReceiptStatus[key];
      var newValue = timestamp;

      if (!value || value < newValue) {
        childBase.cachedReadReceiptStatus[key] = newValue;
      }
    };

    childBase.startTyping = function () {
      var now = new Date().getTime();

      if (now - startTypingLastSentAt < 1000) {
        return;
      }

      endTypingLastSentAt = 0;
      startTypingLastSentAt = now;

      var cmd = Command.bTypeStart(childBase.url, startTypingLastSentAt);
      self.SendBird.getInstance().sendCommand(cmd, null);
    };

    childBase.endTyping = function () {
      var now = new Date().getTime();
      if (now - endTypingLastSentAt < 1000) {
        return;
      }

      startTypingLastSentAt = 0;
      endTypingLastSentAt = now;
      var cmd = Command.bTypeEnd(childBase.url, endTypingLastSentAt);
      self.SendBird.getInstance().sendCommand(cmd, null);
    };

    childBase.invalidateTypingStatus = function () {
      var removed = false;
      var now = new Date().getTime();

      for (var i in cachedTypingStatus) {
        var item = cachedTypingStatus[i];
        if (now - item >= 10 * 1000) {
          delete(cachedTypingStatus[i]);
          removed = true;
        }
      }

      return removed;
    };

    childBase.updateTypingStatus = function (user, start) {
      if (start) {
        cachedTypingStatus[user.userId] = new Date().getTime();
      } else {
        delete(cachedTypingStatus[user.userId]);
      }
    };

    /**
     * Returns true if one or more members are typing.
     * @return
     */
    childBase.isTyping = function () {
      for (var i in cachedTypingStatus) {
        return true;
      }
      return false;
    };

    /**
     * Returns typing member list.
     * @return
     */
    childBase.getTypingMembers = function () {
      var result = [];

      for (var userId in cachedTypingStatus) {
        var user = childBase.memberMap[userId];
        if (childBase.memberMap[userId]) {
          result.push(user);
        }
      }

      return result;
    };

    childBase.addMember = function (user) {
      childBase.removeMember(user);
      childBase.memberMap[user.userId] = user;
      childBase.members.push(user);
      childBase.memberCount++;
      childBase.updateReadReceipt(user.userId, 0);
    };

    childBase.removeMember = function (user) {
      var targetUserId = user.userId;

      if (childBase.memberMap.hasOwnProperty(user.userId)) {
        delete(childBase.memberMap[user.userId]);
        for (var i in childBase.members) {
          var member = childBase.members[i];
          if (member.userId == targetUserId) {
            childBase.members.splice(i, 1);
            break;
          }
        }
        childBase.memberCount--;
      }
    };

    // childBase.updateReadReceipt = function (userId, timestamp) {
    //   var key = userId;
    //   var value = GroupChannel.cachedReadReceiptStatus[key];
    //   var newValue = timestamp;
    //
    //   if (value == null || value < newValue) {
    //     GroupChannel.cachedReadReceiptStatus[key] = newValue;
    //   }
    // };

    if (!jsonObject) {
      return childBase;
    }
    /****************************
     * GroupChannel Constructor
     ****************************/

    childBase.__parse(jsonObject);
    return childBase;
  };


  /*************************************
   * GroupChannelListQuery Class Static
   *************************************/
  GroupChannelListQuery.ORDER_LATEST_LAST_MESSAGE = "latest_last_message";
  GroupChannelListQuery.ORDER_CHRONOLOGICAL = "chronological";

  /***********************************
   * GroupChannelListQuery Class
   ***********************************/
  function GroupChannelListQuery(_user) {
    this.isLoading = false;
    this.limit = 20;
    this.includeEmpty = false;
    this.order = GroupChannelListQuery.ORDER_LATEST_LAST_MESSAGE;
    this.hasNext = true;

    var sInstanse = this;

    var user = _user;
    var token = "";

    /**
     * Request next query result.
     * @param handler ChannelListQueryResultHandler
     */
    this.next = function (cb) {
      if (!sInstanse.hasNext) {
        cb([], null);
        return;
      }

      if (sInstanse.isLoading) {
        cb(null, new SendBirdException("Query in progress.", SendBirdError.QUERY_IN_PROGRESS));
      }

      sInstanse.isLoading = true;

      APIClient.getInstance().loadUserGroupChannelList(user.userId, token, sInstanse.limit, sInstanse.includeEmpty, sInstanse.order, function (response, error) {
        if (error) {
          sInstanse.isLoading = false;
          if (cb) {
            cb(null, error);
          }
          return;
        }

        var result = response;
        token = String(result['next']);
        if (!token || token.length <= 0) {
          sInstanse.hasNext = false;
        }

        var channelObjs = result['channels'];
        var channels = [];

        for (var i in channelObjs) {
          var channel = GroupChannel.__upsert(channelObjs[i]);
          channels.push(channel);
        }

        sInstanse.isLoading = false;
        if (cb) {
          cb(channels, null);
        }
      });
    }
  };


  // /***********************************
  //  * Logger Class
  //  ***********************************/
  // var Logger = function(){
  //   this.NONE = 0;
  //   this.INFO = 1;
  //   this.DEBUG = 98765;
  //
  //   this.level = NONE;
  //
  //   this.i = function (message) {
  //     if(this.level >= this.INFO) {
  //       if (message == null) {
  //         message = "(null)";
  //       }
  //       //console.log(message);
  //     }
  //   };
  //
  //   this.e = function (e) {
  //     if(this.level >= this.INFO) {
  //       if(e != null) {
  //         var message = e.getMessage();
  //         if(message == null) {
  //           message = "(null)";
  //         }
  //         // System.err.println(message);
  //         console.error(message);
  //         //console.log(e);
  //         // e.printStackTrace();
  //       }
  //     }
  //   };
  //
  //   this.e = function(message) {
  //     if(this.level >= this.INFO) {
  //       if(message == null) {
  //         message = "(null)";
  //       }
  //       // System.err.println(message);
  //       console.error(message);
  //     }
  //   };
  //
  //   this.d = function(message) {
  //     if(this.level >= this.DEBUG) {
  //       // System.out.println(message);
  //       //console.log(message);
  //     }
  //   }
  //
  //   this.d = function(e) {
  //     if(this.level >= this.DEBUG) {
  //       if(e != null) {
  //         var message = e.getMessage();
  //         if(message == null) {
  //           message = "(null)";
  //         }
  //         // System.out.println(message);
  //         console.error(message);
  //         //console.log(e);
  //         // e.printStackTrace();
  //       }
  //     }
  //   }
  // };


  /***********************************
   * MessageListQuery Class
   ***********************************/
  function MessageListQuery (_channel) {
    /**
     * Object which retrieves messages from the given channel.
     */
    this.isLoading = false;

    var sInstance = this;
    var channel = _channel;

    this.next = function (messageTimestamp, limit, reverse, cb) {
      if (sInstance.isLoading) {
        cb(null, new SendBirdException("Query in progress.", SendBirdError.QUERY_IN_PROGRESS));
        return;
      }

      sInstance.isLoading = true;
      APIClient.getInstance().messageList(channel.isOpenChannel(), channel.url, messageTimestamp, 0, limit, false, reverse, function (response, error) {
        if (error) {
          sInstance.isLoading = false;
          if (cb) {
            cb(null, error);
          }
          return;
        }

        var result = response;
        var objs = result['messages'];
        var messages = [];
        for (var i in objs) {
          var msg = new BaseMessage(objs[i], channel);
          if (msg) {
            messages.push(msg);
          }
        }

        sInstance.isLoading = false;
        if (cb) {
          cb(messages);
        }
      });
    };

    /**
     * Request previous query result.
     * @param messageTimestamp Starting message timestamp
     * @param limit Limit result
     * @param reverse Reversing the result
     * @param cb
     */
    this.prev = function (messageTimestamp, limit, reverse, cb) {
      if (sInstance.isLoading) {
        cb(null, new SendBirdException("Query in progress.", SendBirdError.QUERY_IN_PROGRESS));
        return;
      }
      sInstance.isLoading = true;
      APIClient.getInstance().messageList(channel.isOpenChannel(), channel.url, messageTimestamp, limit, 0, false, reverse, function (response, error) {
        if (error) {
          sInstance.isLoading = false;
          if (cb) {
            cb(null, error);
          }
          return;
        }

        var result = response;
        var objs = result['messages'];
        var messages = [];
        for (var i in objs) {
          var msg = new BaseMessage(objs[i], channel);
          if (msg) {
            messages.push(msg);
          }
        }

        sInstance.isLoading = false;
        if (cb) {
          cb(messages);
        }
      });
    };


    /**
     * Request first query result with previous message limit and next message limit based on a given message timestamp.
     * @param messageTimestamp Pivot timestamp
     * @param prevLimit Total number of previous messages to load
     * @param nextLimit Total number of next messages to load
     * @param reverse Reversing the result
     * @param handler MessageListQueryResult
     */
    this.load = function (messageTimestamp, prevLimit, nextLimit, reverse, cb) {
      if (sInstance.isLoading) {
        cb(null, new SendBirdException("Query in progress.", SendBirdError.QUERY_IN_PROGRESS));
        return;
      }
      sInstance.isLoading = true;
      APIClient.getInstance().messageList(channel.isOpenChannel(), channel.url, messageTimestamp, prevLimit, nextLimit, true, reverse, function (response, error) {
        if (error) {
          sInstance.isLoading = false;
          if (cb) {
            cb(null, error);
          }
          return;
        }

        var result = response;
        var objs = result['messages'];
        var messages = [];
        for (var i in objs) {
          var msg = new BaseMessage(objs[i], channel);
          if (msg) {
            messages.push(msg);
          }
        }

        sInstance.isLoading = false;
        if (cb) {
          cb(messages);
        }
      });
    };

  };


  /***********************************
   * OpenChannel Class Static Method
   ***********************************/
  OpenChannel.enteredChannels = {};

  OpenChannel.clearEnteredChannels = function () {
    OpenChannel.enteredChannels = {};
  };

  OpenChannel.createOpenChannelListQuery = function () {
    return new OpenChannelListQuery();
  };

  OpenChannel.createChannel = function () {
    var name;
    var coverUrl;
    var data;
    var operatorUserIds;
    var cb;

    switch (arguments.length) {
      case 1:
        cb = arguments[0];
        break;
      case 4:
        name = arguments[0];
        coverUrl = arguments[1];
        data = arguments[2];
        cb = arguments[3];
        break;
      case 5:
        name = arguments[0];
        coverUrl = arguments[1];
        data = arguments[2];
        operatorUserIds = arguments[3];
        cb = arguments[4];
        break;
    }

    OpenChannel.createChannelWithOperatorUserIds(name, coverUrl, data, operatorUserIds, cb);
  };

  /**
   * Create new open channel with given information
   * @param name
   * @param coverUrl
   * @param data
   * @param operatorUserIds
   * @param cb
   */
  OpenChannel.createChannelWithOperatorUserIds = function(name, coverUrl, data, operatorUserIds, cb) {
    APIClient.getInstance().createOpenChannel(name, coverUrl, data, operatorUserIds, function(response, error){
      if (error) {
        if (cb) {
          cb(null, error);
        }
        return;
      }

      var channel = OpenChannel.__upsert(response);

      if (cb) {
        cb(channel);
      }
    });
  };

  OpenChannel.getChannel = function (channelUrl, cb) {
    if (OpenChannel.cachedChannels.hasOwnProperty(channelUrl)) {
      if (cb) {
        cb(OpenChannel.cachedChannels[channelUrl]);
      }
    } else {
      APIClient.getInstance().getOpenChannel(channelUrl, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        var channel = new OpenChannel(response);
        if (cb) {
          cb(channel);
        }
      });
    }
  };

  OpenChannel.__upsert = function (jsonObject) {
    var newChannel = new OpenChannel(jsonObject);

    if (OpenChannel.cachedChannels.hasOwnProperty(newChannel.url)) {
      OpenChannel.cachedChannels[newChannel.url].__update(jsonObject);
    } else {
      OpenChannel.cachedChannels[newChannel.url] = newChannel;
    }

    // Do not return the newChannel. It will break single instance restriction.
    return OpenChannel.cachedChannels[newChannel.url];
  };

  OpenChannel.cachedChannels = {};

  OpenChannel.getChannelWithoutCache = function (channelUrl, cb) {
    APIClient.getInstance().getOpenChannel(channelUrl, function (response, error) {
      if (error) {
        if (cb) {
          cb(null, error);
        }
        return;
      }

      OpenChannel.__upsert(response);

      if (cb) {
        cb(OpenChannel.cachedChannels[channelUrl], null);
      }
    });
  };

  /***********************************
   * OpenChannel Class
   ***********************************/
  function OpenChannel(jsonObject) {
    var childBase = new BaseChannel(jsonObject);
    childBase.channelType = BaseChannel.CHANNEL_TYPE_OPEN;
    childBase.participantCount;
    childBase.operators = [];

    childBase.refresh = function (cb) {
      OpenChannel.getChannelWithoutCache(childBase.url, function (channel, error) {
        if (error) {
          if (cb) {
            cb(null, error)
          }
          return;
        }

        if (cb) {
          cb();
        }
      });
    };

    childBase.__parse = function (jsonObject) {
      if (jsonObject.hasOwnProperty('participant_count')) {
        childBase.participantCount = parseInt(jsonObject['participant_count']);
      }

      if (jsonObject.hasOwnProperty('operators') && jsonObject['operators']) {
        childBase.operators = [];
        for (var i in jsonObject['operators']) {
          var operator = new User(jsonObject['operators'][i]);
          childBase.operators.push(operator);
        }
      }
    };

    childBase.__update = function (jsonObject) {
      childBase.___update(jsonObject);
      childBase.__parse(jsonObject);
    };

    childBase.enter = function (cb) {
      var cmd = Command.bEnter(childBase.url);
      self.SendBird.getInstance().sendCommand(cmd, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        // if (!OpenChannel.enteredChannels.hasOwnProperty(childBase.url)) {
        //   childBase.participantCount++;
        // }
        OpenChannel.enteredChannels[childBase.url] = childBase;

        if (cb) {
          cb(null);
        }
      });
    };

    childBase.exit = function (cb) {
      var cmd = Command.bExit(childBase.url);
      self.SendBird.getInstance().sendCommand(cmd, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        delete(OpenChannel.enteredChannels[childBase.url]);

        if (cb) {
          cb(null);
        }
      });
    };

    /**
     * Creates a query instance to get the whole participant list of this channel.
     * @return A query instance for the whole participant list.
     */
    childBase.createParticipantListQuery = function() {
      return new UserListQuery(UserListQuery.PARTICIPANT, childBase);
    };

    /**
     * Creates a query instance to get the muted participant list of this channel.
     * @return A query instance for the muted participant list.
     */
    childBase.createMutedUserListQuery = function() {
      return new UserListQuery(UserListQuery.MUTED_USER, childBase);
    };

    childBase.createBannedUserListQuery = function() {
      return new UserListQuery(UserListQuery.BANNED_USER, childBase);
    };

    childBase.banUser = function (user, seconds, cb) {
      if (!user || parseInt(seconds) < 0) {
        if (cb) {
          cb(null, new SendBirdException("Invalid parameter.", SendBirdError.INVALID_PARAMETER));
        }
        return;
      }

      childBase.banUserWithUserId(user.userId, seconds, cb);
    };

    childBase.banUserWithUserId = function(userId, seconds, cb){
      if (!userId || parseInt(seconds) < 0) {
        if (cb) {
          cb(null, new SendBirdException("Invalid parameter.", SendBirdError.INVALID_PARAMETER));
        }
        return;
      }

      APIClient.getInstance().banUser(childBase.url, userId, null, seconds, function(response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        };

        if (cb) {
          cb();
        }
      });
    };

    childBase.unbanUser = function(user, cb) {
      if (!user) {
        if (cb) {
          cb(null, new SendBirdException("Invalid parameter.", SendBirdError.INVALID_PARAMETER));
        }
        return;
      }

      childBase.unbanUserWithUserId(user.userId, cb);
    };

    childBase.unbanUserWithUserId = function(userId, cb) {
      if (!userId) {
        if (cb) {
          cb(null, new SendBirdException("Invalid parameter.", SendBirdError.INVALID_PARAMETER));
        }
        return;
      }

      APIClient.getInstance().unbanUser(childBase.url, userId, function(response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        };

        if (cb) {
          cb();
        }
      });
    };

    childBase.muteUser = function(user, cb) {
      if (!user) {
        if (cb) {
          cb(null, new SendBirdException("Invalid parameter.", SendBirdError.INVALID_PARAMETER));
        }
        return;
      }

      childBase.muteUserWithUserId(user.userId, cb);
    };

    childBase.muteUserWithUserId = function(userId, cb) {
      if (!userId) {
        if (cb) {
          cb(null, new SendBirdException("Invalid parameter.", SendBirdError.INVALID_PARAMETER));
        }
        return;
      }

      APIClient.getInstance().muteUser(childBase.url, userId, function(response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        };

        if (cb) {
          cb();
        }
      });
    };

    childBase.unmuteUser = function(user, cb) {
      if (!user) {
        if (cb) {
          cb(null, new SendBirdException("Invalid parameter.", SendBirdError.INVALID_PARAMETER));
        }
        return;
      }

      childBase.unmuteUserWithUserId(user.userId, cb);
    };

    childBase.unmuteUserWithUserId = function(userId, cb) {
      if (!userId) {
        if (cb) {
          cb(null, new SendBirdException("Invalid parameter.", SendBirdError.INVALID_PARAMETER));
        }
        return;
      }

      APIClient.getInstance().unmuteUser(childBase.url, userId, function(response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        };

        if (cb) {
          cb();
        }
      });
    };

    childBase.isOperator = function(user) {
      if (!user) {
        return false;
      }

      return childBase.isOperatorWithUserId(user.userId);
    };

    childBase.isOperatorWithUserId = function(userId) {
      for (var i in childBase.operators) {
        if (childBase.operators[i].userId == userId) {
          return true;
        }
      }

      return false;
    };


    /*******************************************
     * Constructor
     */
    if (!jsonObject) {
      return childBase;
    }
    childBase.__parse(jsonObject);
    return childBase;
  };


  /***********************************
   * OpenChannelListQuery Class
   ***********************************/
  var OpenChannelListQuery = function () {
    var token = '';
    var queryInstance = this;

    this.limit = 20;
    this.isLoading = false;
    this.hasNext = true;

    this.next = function (cb) {
      if (!this.hasNext) {
        cb([], null);
        return;
      }

      if (this.isLoading) {
        cb(null, new SendBirdException("WS connection closed.", SendBirdError.QUERY_IN_PROGRESS));
        return;
      }

      queryInstance.isLoading = true;
      APIClient.getInstance().loadOpenChannelList(token, queryInstance.limit, function (response, error) {
        if (error) {
          queryInstance.isLoading = false;
          if (cb) {
            cb(null, error);
          }
          return;
        }

        var result = response;
        token = String(result['next']);
        if (!token) {
          queryInstance.hasNext = false;
        }

        var channelObjs = result['channels'];
        var channels = [];

        channelObjs.forEach(function (item) {
          var channel = OpenChannel.__upsert(item);
          channels.push(channel);
        });

        queryInstance.isLoading = false;
        cb(channels, null);
      });
    };
  };


  /***********************************
   * OpenChannelParticipantListQuery Class
   ***********************************/
  var OpenChannelParticipantListQuery = function (_channel) {
    var channel = _channel;
    var token = "";
    this.hasNext = true;
    this.limit = 20;
    this.isLoading = false;
    this.mutedOnly = false;

    var queryInstance = this;

    /**
     * Request next query result.
     * @param handler OpenChannelParticipantListQueryResultHandler
     */
    this.next = function (cb) {
      if (!queryInstance.hasNext) {
        cb([], null);
        return;
      }

      if (queryInstance.isLoading) {
        cb(null, new SendBirdException("WS connection closed.", SendBirdError.QUERY_IN_PROGRESS));
        return;
      }

      queryInstance.isLoading = true;
      APIClient.getInstance().loadOpenChannelParticipantList(channel.url, token, queryInstance.limit, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          queryInstance.isLoading = false;
          return;
        }

        var result = response;
        token = String(result['next']);
        if (!token || token.length <= 0) {
          queryInstance.hasNext = false;
        }

        var userObjs = result['participants'];
        var users = [];

        userObjs.forEach(function (user) {
          users.push(new User(user));
        });

        queryInstance.isLoading = false;
        if (cb) {
          cb(users);
        }
      });
    }
  };


  /***********************************
   * PreviousMessageListQuery Class
   ***********************************/
  var PreviousMessageListQuery = function (_channel) {
    /**********************
     * Constructor
     */
    var channel = _channel;
    var messageTimestamp = 9223372036854775807;
    var queryInstance = this;

    this.hasMore = true;
    this.isLoading = false;

    this.load = function (limit, reverse, cb) {
      if (!queryInstance.hasMore) {
        return;
      }

      if (queryInstance.isLoading) {
        cb(null, new SendBirdException("WS connection closed.", SendBirdError.QUERY_IN_PROGRESS));
        return;
      }

      queryInstance.isLoading = true;
      APIClient.getInstance().messageList(channel.isOpenChannel(), channel.url, messageTimestamp, limit, 0, false, reverse, function (response, error) {
        if (error) {
          queryInstance.isLoading = false;
          if (cb) {
            cb(null, error);
          }
          return;
        }

        var result = response;
        var objs = result['messages'];
        var messages = [];

        for (var i in objs) {
          var msg = BaseMessage.build(objs[i], channel);
          if (msg) {
            messages.push(msg);

            if (msg.createdAt <= messageTimestamp) {
              messageTimestamp = msg.createdAt;
            }
          }
        }

        if (messages.length <= 0) {
          queryInstance.hasMore = false;
        }

        queryInstance.isLoading = false;
        if (cb) {
          cb(messages);
        };
      });
    };
  };


  /***********************************
   * ReadStatus Class
   ***********************************/
  var ReadStatus = function (jsonObject) {
    this.reader;
    this.timestamp;
    this.channelUrl;
    this.channelType;

    // console.log(jsonObject);

    this.reader = new User(jsonObject['user']);
    this.timestamp = parseInt(jsonObject['ts']);
    this.channelUrl = jsonObject.hasOwnProperty('channel_url') ? String(jsonObject['channel_url']) : "";
    this.channelType = jsonObject.hasOwnProperty('channel_type') ? String(jsonObject['channel_type']) : BaseChannel.CHANNEL_TYPE_GROUP;
  };


  /***********************************
   * SendBird Class Static
   ***********************************/

  /***********************************
   * SendBird Class
   ***********************************/
  function SendBird(_initParams) {

    //console.log('SendBird init()');

    var appId;
    var sInstance = null;
    var CMD_ACK_TIMEOUT = 10 * 1000;

    this.loginTimer;
    this.globalTimer;

    // try {
    //   this.OSVersion = navigator.userAgent.replace(/,/g, '.');
    // } catch (e) {
    //   this.OSVersion = 'undefined';
    // }
    // this.SDKVersion = '3.0.0';

    this.getInstance = function () {
      return sInstance;
    };

    this.connectionState = {
      CONNECTING: 'CONNECTING',
      OPEN: 'OPEN',
      CLOSING: 'CLOSING',
      CLOSED: 'CLOSED'
    };

    this.getConnectionState = function(){
      if (!sInstance) {
        return this.connectionState.CLOSED;
      }

      try {
        if (self.WSClient) {
          return self.WSClient.getConnectionState();
        } else {
          return sInstance.connectionState.CLOSED;
        }
      } catch(e) {
        return sInstance.connectionState.CLOSED;
      }
    };

    this.getApplicationId = function () {
      return appId;
    };

    var ackStateMap = {};

    var getAckInfo = function (requestId) {
      if (ackStateMap.hasOwnProperty(requestId)) {
        return ackStateMap[requestId];
      } else {
        return null;
      }
    };

    this.currentUser = null;

    var messageReceived = function (message) {
      // console.log('MESSAGE RECEIVED');
      // console.log(message);
      var cmd = new Command(message);
      // //console.log(cmd.requestId + ":" + cmd.command + ":" + cmd.payload);

      // Ack commands should not be passed to onMessageReceived callback.
      if (cmd.requestId) {
        var ackInfo = getAckInfo(cmd.requestId);
        if (ackInfo == null) { // Ack timeout. Discard the command.
          return;
        }

        // The command is successfully sent and acked.
        clearTimeout(ackInfo['timer']);
        var cb = ackInfo['handler'];

        if (cb) {
          if (cmd.command == 'EROR') {
            var error = cmd.getJsonElement();
            var errCode = error['code'];
            var errMessage = error['message'];

            cb(cmd, new SendBirdException(errMessage, errCode));
          } else {
            cb(cmd, null);
          }
        }

        // TODO: remove item from ackStateMap
        return;
      }

      switch (cmd.command) {
        case 'LOGI':
          clearTimeout(self.SendBird.loginTimer);
          break;
        case 'MESG':
          if (!msg) {
            var msg = new UserMessage(cmd.getJsonElement());
          }
        case 'FILE':
          if (!msg) {
            var msg = new FileMessage(cmd.getJsonElement());
          }
        case 'BRDM':
        case 'ADMM':
          if (!msg) {
            var msg = new AdminMessage(cmd.getJsonElement());
          }

          if (!msg) {
            //console.log("Discard a command: " + cmd.command);
            return;
          }

          if (msg.isGroupChannel()) {
            GroupChannel.getChannel(msg.channelUrl, function (channel, error) {
              if (error) {
                if (cb) {
                  cb(null, error);
                }
                return;
              }

              channel.lastMessage = msg;
              channel.unreadMessageCount++;

              for (var i in self.SendBird.channelHandlers) {
                var handler = self.SendBird.channelHandlers[i];
                handler.onMessageReceived(channel, msg);
              }
            });
          } else {
            OpenChannel.getChannel(msg.channelUrl, function (channel, error) {
              if (error) {
                //console.log(error);
                if (cb) {
                  cb(null, error);
                }
                return;
              }

              for (var i in self.SendBird.channelHandlers) {
                var handler = self.SendBird.channelHandlers[i];
                handler.onMessageReceived(channel, msg);
              }
            });
          }
          break;
        case "READ":
          var rst = new ReadStatus(cmd.getJsonElement());
          new GroupChannel.getChannel(rst.channelUrl, function (channel, error) {
            if (error) {
              if (cb) {
                cb(null, error);
              }
              return;
            }

            // console.log('READ', rst);
            channel.updateReadReceipt(rst.reader.userId, rst.timestamp);
            for (var i in self.SendBird.channelHandlers) {
              var handler = self.SendBird.channelHandlers[i];
              handler.onReadReceiptUpdated(channel);
            }
          });
          break;

        // } else if(cmd.command.equals("TPST") || cmd.command.equals("TPEN")) {
        //   // Ignore TPST, TPEN. It has been replaced with ChannelEvent.
        // } else if(cmd.command.equals("MTIO")) {

        case 'TPST':
        case 'TPEN':
          break;
        case 'MTIO':
          // TODO: Fursys
          break;
        case 'SYEV':
          processChannelEvent(cmd);
          break;

        case 'DELM':
          var obj = cmd.getJsonElement();
          var channelType = String(obj['channel_type']);
          var channelUrl = String(obj['channel_url']);
          var msgId = String(obj['msg_id']);

          switch(channelType){
            case BaseChannel.CHANNEL_TYPE_OPEN:
              OpenChannel.getChannel(channelUrl, function(channel, error){
                if (error) {
                  console.error('Discard a command.');
                  return;
                }

                for (var i in self.SendBird.channelHandlers) {
                  var handler = self.SendBird.channelHandlers[i];
                  handler.onMessageDeleted(channel, msgId);
                }
              });
              break;
            case BaseChannel.CHANNEL_TYPE_GROUP:
              GroupChannel.getChannel(channelUrl, function(channel, error){
                if (error) {
                  console.error('Discard a command.');
                  return;
                }

                for (var i in self.SendBird.channelHandlers) {
                  var handler = self.SendBird.channelHandlers[i];
                  handler.onMessageDeleted(channel, msgId);
                }
              });
              break;
          }

          break;
        case 'LEAV':
          // //console.log('LEAV!!');
          break;
        case 'JOIN':
          // //console.log('JOIN!!');
          break;
        case 'PONG':
          // in WSClient
          break;
        default:
        //console.log('discard command:', cmd.command);

      }
    };

    var processChannelEvent = function (cmd) {
      // console.log('## processChannelEvent called');
      var event = new ChannelEvent(cmd.getJsonElement());

      switch (event.category) {
        case ChannelEvent.CATEGORY_CHANNEL_JOIN:
        case ChannelEvent.CATEGORY_CHANNEL_LEAVE:
          GroupChannel.getChannel(event.channelUrl, function (channel, error) {
            if (error) {
              debug.error('Discard a command: ' + cmd.command + ':' + event.category);
              return;
            }

            var user = new User(event.data);

            if (event.category == ChannelEvent.CATEGORY_CHANNEL_JOIN) {
              channel.addMember(user);
              for (var i in self.SendBird.channelHandlers) {
                var handler = self.SendBird.channelHandlers[i];
                handler.onUserJoined(channel, user);
              }
            } else {
              channel.removeMember(user);
              for (var i in self.SendBird.channelHandlers) {
                var handler = self.SendBird.channelHandlers[i];
                handler.onUserLeft(channel, user);
              }
            }
          });
          break;
        case ChannelEvent.CATEGORY_TYPING_START:
        case ChannelEvent.CATEGORY_TYPING_END:
          GroupChannel.getChannel(event.channelUrl, function (channel, error) {
            if (error) {
              debug.error('Discard a command: ' + cmd.command + ':' + event.category);
              return;
            }

            var user = new User(event.data);
            if (event.category == ChannelEvent.CATEGORY_TYPING_START) {
              channel.updateTypingStatus(user, true);
            } else {
              channel.updateTypingStatus(user, false);
            }

            for (var i in self.SendBird.channelHandlers) {
              var handler = self.SendBird.channelHandlers[i];
              handler.onTypingStatusUpdated(channel);
            }
          });
          break;
        case ChannelEvent.CATEGORY_CHANNEL_ENTER:
        case ChannelEvent.CATEGORY_CHANNEL_EXIT:
          OpenChannel.getChannel(event.channelUrl, function (channel, error) {
            if (error) {
              debug.error('Discard a command: ' + cmd.command + ':' + event.category);
              return;
            }

            var user = new User(event.data);

            if (event.category == ChannelEvent.CATEGORY_CHANNEL_ENTER) {
              channel.participantCount++;
              for (var i in self.SendBird.channelHandlers) {
                var handler = self.SendBird.channelHandlers[i];
                handler.onUserEntered(channel, user);
              }
            } else {
              channel.participantCount--;
              for (var i in self.SendBird.channelHandlers) {
                var handler = self.SendBird.channelHandlers[i];
                handler.onUserExited(channel, user);
              }
            }
          });
          break;

        case ChannelEvent.CATEGORY_USER_CHANNEL_MUTE:
        case ChannelEvent.CATEGORY_USER_CHANNEL_UNMUTE:
          OpenChannel.getChannel(event.channelUrl, function (channel, error) {
            if (error) {
              debug.error('Discard a command: ' + cmd.command + ':' + event.category);
              return;
            }

            var user = new User(event.data);

            if (event.category == ChannelEvent.CATEGORY_USER_CHANNEL_MUTE) {
              for (var i in self.SendBird.channelHandlers) {
                var handler = self.SendBird.channelHandlers[i];
                handler.onUserMuted(channel, user);
              }
            } else {
              for (var i in self.SendBird.channelHandlers) {
                var handler = self.SendBird.channelHandlers[i];
                handler.onUserUnmuted(channel, user);
              }
            }
          });
          break;

        case ChannelEvent.CATEGORY_USER_CHANNEL_BAN:
        case ChannelEvent.CATEGORY_USER_CHANNEL_UNBAN:
          OpenChannel.getChannel(event.channelUrl, function (channel, error) {
            if (error) {
              debug.error('Discard a command: ' + cmd.command + ':' + event.category);
              return;
            }

            var user = new User(event.data);

            if (event.category == ChannelEvent.CATEGORY_USER_CHANNEL_BAN) {
              for (var i in self.SendBird.channelHandlers) {
                var handler = self.SendBird.channelHandlers[i];
                handler.onUserBanned(channel, user);
              }
            } else {
              for (var i in self.SendBird.channelHandlers) {
                var handler = self.SendBird.channelHandlers[i];
                handler.onUserUnbanned(channel, user);
              }
            }
          });
          break;

        case ChannelEvent.CATEGORY_CHANNEL_FREEZE:
        case ChannelEvent.CATEGORY_CHANNEL_UNFREEZE:
          OpenChannel.getChannel(event.channelUrl, function (channel, error) {
            if (error) {
              debug.error('Discard a command: ' + cmd.command + ':' + event.category);
              return;
            }

            if (event.category == ChannelEvent.CATEGORY_CHANNEL_FREEZE) {
              for (var i in self.SendBird.channelHandlers) {
                var handler = self.SendBird.channelHandlers[i];
                handler.onChannelFrozen(channel);
              }
            } else {
              for (var i in self.SendBird.channelHandlers) {
                var handler = self.SendBird.channelHandlers[i];
                handler.onChannelUnfrozen(channel);
              }
            }
          });
          break;

        case ChannelEvent.CATEGORY_CHANNEL_DELETED:
          if (event.isGroupChannel()) {
            for (var i in self.SendBird.channelHandlers) {
              var handler = self.SendBird.channelHandlers[i];
              handler.onChannelDeleted(event.channelUrl, 'group');
            }
          } else {
            for (var i in self.SendBird.channelHandlers) {
              var handler = self.SendBird.channelHandlers[i];
              handler.onChannelDeleted(event.channelUrl, 'open');
            }
          }

          break;
        case ChannelEvent.CATEGORY_CHANNEL_PROP_CHANGED:
          if (event.isOpenChannel()) {
            OpenChannel.getChannelWithoutCache(event.channelUrl, function(channel, error){
              if (error) {
                debug.error('Discard a command: ' + cmd.command + ':' + event.category);
                return;
              }

              for (var i in self.SendBird.channelHandlers) {
                var handler = self.SendBird.channelHandlers[i];
                handler.onChannelChanged(channel);
              }
            });
          } else {
            GroupChannel.getChannelWithoutCache(event.channelUrl, function(channel, error){
              if (error) {
                debug.error('Discard a command: ' + cmd.command + ':' + event.category);
                return;
              }

              for (var i in self.SendBird.channelHandlers) {
                var handler = self.SendBird.channelHandlers[i];
                handler.onChannelChanged(channel);
              }
            });
          }
          break;
      }
    };

    this.connect = function (userId, accessToken, cb) {
      //console.log('connect called: ' + userId);
      if (typeof accessToken == 'function') {
        cb = accessToken;
        accessToken = null;
      }

      if (!sInstance.currentUser || sInstance.currentUser.userId != userId) {
        self.APIClient.login(userId, accessToken, function (response, error) {
          if (error) {
            sInstance.disconnect();
            //console.log('error:', error);
            if (cb) {
              cb(null, error);
            }
          } else {
            var user = new User(response);
            connectWS(user, cb);
          }
        });
      } else {
        connectWS(sInstance.currentUser, cb);
      }
    };

    this.createUserListQuery = function () {
      return new UserListQuery();
    };

    this.disconnect = function (cb) {
      // TODO: disconnect (reset all timer / reconnect)

      //console.log('Disconnect.');
      clearTimeout(self.SendBird.globalTimer);
      clearTimeout(self.SendBird.loginTimer);

      self.SendBird.currentUser = null;
      if (cb) {
        cb();
      }
    };

    var connectWS = function (user, cb) {
      //console.log('connectWS called: user -', user.userId);

      if (!self.WSClient) {
        var WSClientHandler = new WSClient.WSClientHandler();

        WSClientHandler.onMessage = function (message) {
          // //console.log('WSClientHandler.onMessage', message);
          messageReceived(message);
        };

        WSClientHandler.onOpen = function (e) {
          // //console.log('WSClientHandler.onOpen', e);

          WSClientHandler.isOpened = true;
          self.SendBird.loginTimer = setTimeout(function () {
            //console.log("Connect login timer failed.");
            self.SendBird.disconnect(null);
            if (cb) {
              cb(null, new SendBirdException("Connection timeout.", SendBirdError.LOGIN_TIMEOUT));
            }
          }, CMD_ACK_TIMEOUT);

          self.SendBird.currentUser = user;

          clearTimeout(self.SendBird.globalTimer);
          var globalTimerLoop = function () {
            if (GroupChannel.cachedChannels) {
              for (var i in GroupChannel.cachedChannels) {
                var channel = GroupChannel.cachedChannels[i];
                channel.fireMarkAsRead();

                if (channel.invalidateTypingStatus()) {
                  for (var i2 in self.SendBird.channelHandlers) {
                    var channelHandler = self.SendBird.channelHandlers[i2];
                    channelHandler.onTypingStatusUpdated(channel);
                  }
                }
              }
            }

            self.SendBird.globalTimer = setTimeout(function () {
              globalTimerLoop();
            }, 1000);
          };
          globalTimerLoop();
        };

        WSClientHandler.onError = function (error) {
          console.error('WSClientHandler.onError', error);
        };

        WSClientHandler.onClose = function (explicitDiconnect) {
          //console.log('WSClientHandler.onClose, explicitDiconnect: ', explicitDiconnect);
          WSClientHandler.isOpened = false;
          self.SendBird.disconnect();
        };

        WSClientHandler.onErrorClose = function (e) {
          //console.log('WSClientHandler.onErrorClosed', e);
          WSClientHandler.isOpened = false;
        };

        WSClientHandler.onReconnectStarted = function () {
          for (var i in self.SendBird.connectionHandlers) {
            var handler = self.SendBird.connectionHandlers[i];
            handler.onReconnectStarted(i);
          }
        };

        WSClientHandler.onReconnectFailed = function () {
          for (var i in self.SendBird.connectionHandlers) {
            var handler = self.SendBird.connectionHandlers[i];
            handler.onReconnectFailed(i);
          }
        };

        WSClientHandler.onReconnectSucceeded = function () {
          for (var i in self.SendBird.connectionHandlers) {
            var handler = self.SendBird.connectionHandlers[i];
            handler.onReconnectSucceeded(i);
          }
        };

        self.WSClient = new WSClient(this.appId, sInstance.SDKVersion, self.APIClient.sessionKey, WSClientHandler);
      }

      self.APIClient.checkRouting(function (result, error) {
        self.WSClient.connect(user, WS_HOST, cb);
      });
    };

    this.sendCommand = function (cmd, cb) {
      if (self.WSClient == null || self.WSClient.getConnectionState() != self.SendBird.connectionState['OPEN']) {
        if (cb) {
          cb(null, new SendBirdException("WS connection closed.", SendBirdError.WEBSOCKET_CONNECTION_CLOSED));
        }
        return;
      }

      if (cmd.isAckRequired()) {
        // ******************************************************** startAckTimer
        var reqId = cmd.requestId;
        var obj = {
          handler: cb,
          timer: setTimeout(function () {
            cb(null, new SendBirdException("Command received no ack.", SendBirdError.ACK_TIMEOUT));
            delete(ackStateMap[reqId]);
          }, CMD_ACK_TIMEOUT)
        };

        ackStateMap[reqId] = obj;
        //console.log('new command require id: ', reqId);
        // ******************************************************** startAckTimer
        self.WSClient.send(cmd, function (response, error) {
          if (error) {
            //console.log(error);
            clearTimeout(obj['timer']);
            cb(null, error);
            return;
          }
        });
        // Sending command success handler will be called when ack received in messageReceived.
      } else {
        self.WSClient.send(cmd, cb);
      }
    };

    /***********************************
     SendBird Event Handler
     **********************************/
    this.channelHandlers = {};

    this.ChannelHandler = function () {
      /**
       * A callback when a message received.
       *
       * @param message The message object
       */
      this.onMessageReceived = function (channel, message) {
        //console.log('ChnnelHandler.onMessageReceived: ', channel, message);
      };

      /**
       * A callback when a message is deleted.
       *
       * @param channel The channel the deleted message belongs to.
       * @param msgId The ID of the deleted message.
       */
      this.onMessageDeleted = function (channel, msgId) {
        //console.log('ChnnelHandler.onMessageDeleted: ', channel, msgId);
      };

      /**
       * A callback when read receipts updated.
       * @param channel The group channel where the read receipt updated.
       */
      this.onReadReceiptUpdated = function (channel) {
        //console.log('ChnnelHandler.onReadReceiptUpdated: ', channel);
      };

      /**
       * A callback when user send typing status.
       * @param channel The group channel where the typing status updated.
       */
      this.onTypingStatusUpdated = function (channel) {
        //console.log('ChnnelHandler.onTypingStatusUpdated: ', channel);
      };

      /**
       * A callback when new member joined to the group channel.
       *
       * @param channel The group channel
       * @param user The new user joined to the channel
       */
      this.onUserJoined = function (channel, user) {
        //console.log('ChnnelHandler.onUserJoined: ', channel, user);
      };

      /**
       * A callback when current member left from the group channel.
       *
       * @param channel The group channel
       * @param user The member left from the channel
       */
      this.onUserLeft = function (channel, user) {
        //console.log('ChnnelHandler.onUserLeft: ', channel, user);
      };


      /**
       * A callback when user enters the open channel.
       *
       * @param channel The open channel
       * @param user The new participant
       */
      this.onUserEntered = function(channel, user){
        //console.log('ChnnelHandler.onUserEntered: ', channel, user);
      };

      /**
       * A callback when user exits the open channel.
       *
       * @param channel The open channel
       * @param user The ex-participant
       */
      this.onUserExited = function(channel, user) {
        //console.log('ChnnelHandler.onUserExited: ', channel, user);
      };

      /**
       * A callback when user is muted.
       *
       * @param channel The open channel
       * @param user The muted user
       */
      this.onUserMuted = function(channel, user) {
        //console.log('ChnnelHandler.onUserMuted: ', channel, user);
      };

      /**
       * A callback when user is unmuted.
       *
       * @param channel The open channel
       * @param user The unmuted user
       */
      this.onUserUnmuted = function(channel, user) {
        //console.log('ChnnelHandler.onUserUnmuted: ', channel, user);
      };

      /**
       * A callback when user is banned.
       *
       * @param channel The open channel
       * @param user The banned user
       */
      this.onUserBanned = function(channel, user) {
        //console.log('ChnnelHandler.onUserBanned: ', channel, user);
      };

      /**
       * A callback when user is unbanned.
       *
       * @param channel The open channel
       * @param user The banned user
       */
      this.onUserUnbanned = function(channel, user) {
        //console.log('ChnnelHandler.onUserUnbanned: ', channel, user);
      };

      /**
       * A callback when channel is frozen.
       *
       * @param channel The open channel
       */
      this.onChannelFrozen = function(channel) {
        //console.log('ChnnelHandler.onChannelFrozen: ', channel);
      };

      /**
       * A callback when channel is unfrozen.
       *
       * @param channel The open channel
       */
      this.onChannelUnfrozen = function(channel) {
        //console.log('ChnnelHandler.onChannelUnfrozen: ', channel);
      };

      /**
       * A callback when channel property is changed.
       * @param channel The base channel
       */
      this.onChannelChanged = function(channel) {
        //console.log('ChnnelHandler.onChannelChanged: ', channel);
      };

      /**
       * A callback when channel is deleted.
       * @param channel The base channel
       */
      this.onChannelDeleted = function(channel) {
        //console.log('ChnnelHandler.onChannelDeleted: ', channel);
      };


    };

    this.addChannelHandler = function (id, handler) {
      // //console.log('add handler');
      sInstance.channelHandlers[id] = handler;
    };

    this.removeChannelHandler = function (id) {
      delete(sInstance.channelHandlers[id]);
    };

    this.connectionHandlers = {};

    this.ConnectionHandler = function () {
      /**
       * A callback when begins trying to reconnect.
       */
      this.onReconnectStarted = function () {
        //console.log('ConnectionHandler.onReconnectStarted: ');
      };

      /**
       * A callback when connection is reestablished.
       */
      this.onReconnectSucceeded = function () {
        //console.log('ConnectionHandler.onReconnectSucceeded: ');
      };

      /**
       * A callback when reconnecting failed.
       */
      this.onReconnectFailed = function () {
        //console.log('ConnectionHandler.onReconnectFailed: ');
      };
    };

    this.addConnectionHandler = function (id, cb) {
      sInstance.connectionHandlers[id] = cb;
    };

    this.removeConnectionHandler = function (id) {
      delete(sInstance.connectionHandlers[id]);
    };

    this.createUserListQuery = function() {
      return new UserListQuery(UserListQuery.ALL_USER);
    };

    this.createBlockedUserListQuery = function() {
      return new UserListQuery(UserListQuery.BLOCKED_USER);
    };

    this.updateCurrentUserInfoWithProfileImage = function(nickname, profileImage, cb){
      if (!self.SendBird.currentUser) {
        if (cb) {
          cb(null, new SendBirdException("Connection must be made before you update user information.", SendBirdError.INVALID_INITIALIZATION));
        }
        return;
      }

      if (!profileImage) {
        this.updateCurrentUserInfo(nickname, null, cb);
      } else {
        APIClient.getInstance().uploadProfileImage(profileImage, function(response, error){
          if (error) {
            if (cb) {
              cb(error);
            }
            return;
          }

          var fileUrl = response['url'];
          this.updateCurrentUserInfo(nickname, fileUrl, cb);
        });
      }
    };

    this.updateCurrentUserInfo = function (nickname, profileUrl, cb) {
      if (!self.SendBird.currentUser) {
        if (cb) {
          cb(null, new SendBirdException("Connection must be made before you update user information.", SendBirdError.INVALID_INITIALIZATION));
        }
        return;
      }

      APIClient.getInstance().updateUserInfo(self.SendBird.currentUser.userId, nickname, profileUrl, function(response, error){
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        if (nickname) {
          self.SendBird.currentUser.nickname = nickname;
        }

        if (profileUrl) {
          self.SendBird.currentUser.profileUrl = profileUrl;
        }

        if (cb) {
          cb();
        }
      });
    };

    this.registerGCMPushTokenForCurrentUser = function (gcmRegToken, cb) {
      if (!self.SendBird.currentUser) {
        cb(null, new SendBirdException("Connection must be made before you register push token.", SendBirdError.INVALID_INITIALIZATION));
        return;
      }

      APIClient.getInstance().registerGCMPushToken(self.SendBird.currentUser.userId, gcmRegToken, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        if (cb) {
          cb();
        }
      });
    };

    this.unregisterGCMPushTokenForCurrentUser = function (gcmRegToken, cb) {
      if (!self.SendBird.currentUser) {
        cb(null, new SendBirdException("Connection must be made before you unregister push token.", SendBirdError.INVALID_INITIALIZATION));
        return;
      }

      APIClient.getInstance().unregisterGCMPushToken(self.SendBird.currentUser.userId, gcmRegToken, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        if (cb) {
          cb();
        }
      });
    };

    this.unregisterGCMPushTokenAllForCurrentUser = function (cb) {
      if (!self.SendBird.currentUser) {
        cb(null, new SendBirdException("Connection must be made before you unregister push token.", SendBirdError.INVALID_INITIALIZATION));
        return;
      }

      APIClient.getInstance().unregisterGCMPushTokenAll(self.SendBird.currentUser.userId, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        if (cb) {
          cb();
        }
      });
    };

    this.registerAPNSPushTokenForCurrentUser = function (apnsRegToken, cb) {
      if (!self.SendBird.currentUser) {
        cb(null, new SendBirdException("Connection must be made before you register push token.", SendBirdError.INVALID_INITIALIZATION));
        return;
      }

      APIClient.getInstance().registerAPNSPushToken(self.SendBird.currentUser.userId, apnsRegToken, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        if (cb) {
          cb();
        }
      });
    };

    this.unregisterAPNSPushTokenForCurrentUser = function (apnsRegToken, cb) {
      if (!self.SendBird.currentUser) {
        cb(null, new SendBirdException("Connection must be made before you unregister push token.", SendBirdError.INVALID_INITIALIZATION));
        return;
      }

      APIClient.getInstance().unregisterAPNSPushToken(self.SendBird.currentUser.userId, apnsRegToken, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        if (cb) {
          cb();
        }
      });
    };

    this.unregisterAPNSPushTokenAllForCurrentUser = function (cb) {
      if (!self.SendBird.currentUser) {
        cb(null, new SendBirdException("Connection must be made before you unregister push token.", SendBirdError.INVALID_INITIALIZATION));
        return;
      }

      APIClient.getInstance().unregisterAPNSPushTokenAll(self.SendBird.currentUser.userId, function (response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        if (cb) {
          cb();
        }
      });
    };

    this.blockUser = function(userToBlock, cb){
      if (!self.SendBird.currentUser || self.SendBird.currentUser.userId == userToBlock.userId) {
        if (cb) {
          cb(null, new SendBirdException("Invalid operation.", SendBirdError.INVALID_INITIALIZATION));
        }
        return;
      }

      this.blockUserWithUserId(userToBlock.userId, cb);
    };

    this.blockUserWithUserId = function(userIdToBlock, cb) {
      if (!self.SendBird.currentUser || self.SendBird.currentUser.userId == userToBlock.userId) {
        if (cb) {
          cb(null, new SendBirdException("Invalid operation.", SendBirdError.INVALID_INITIALIZATION));
        }
        return;
      }

      APIClient.getInstance().blockUser( self.SendBird.currentUser.userId, userIdToBlock, function(response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        if (cb) {
          cb(new User(response));
        }
      });
    };

    this.unblockUser = function(blockedUser, cb){
      if (!self.SendBird.currentUser) {
        if (cb) {
          cb(null, new SendBirdException("Connection must be made before you unblock users.", SendBirdError.INVALID_INITIALIZATION));
        }
        return;
      }

      this.unblockUserWithUserId(blockedUser.userId, cb);
    };

    this.unblockUserWithUserId = function(blockedUserId, cb){
      if (!self.SendBird.currentUser) {
        if (cb) {
          cb(null, new SendBirdException("Connection must be made before you unblock users.", SendBirdError.INVALID_INITIALIZATION));
        }
        return;
      }

      APIClient.getInstance().unblockUser( self.SendBird.currentUser.userId, blockedUserId, function(response, error) {
        if (error) {
          if (cb) {
            cb(null, error);
          }
          return;
        }

        if (cb) {
          cb();
        }
      });
    };

    /***********************************
     SendBird Class Construct
     **********************************/
    appId = _initParams['appId'];
    sInstance = this;

    // for static method
    this.OpenChannel = OpenChannel;
    this.GroupChannel = GroupChannel;
    this.UserMessage = UserMessage;

    APIClient.init();
    self.APIClient = APIClient.getInstance();
    return this;
  };

  /***********************************
   * SendBirdError Class Static
   ***********************************/
  // SDK Internal Errors
  SendBirdError.INVALID_INITIALIZATION            = 800100;
  SendBirdError.CONNECTION_REQUIRED               = 800101;
  SendBirdError.INVALID_PARAMETER                 = 800110;
  SendBirdError.NETWORK_ERROR                     = 800120;
  SendBirdError.NETWORK_ROUTING_ERROR             = 800121;
  SendBirdError.MALFORMED_DATA                    = 800130;
  SendBirdError.MALFORMED_ERROR_DATA              = 800140;
  SendBirdError.WRONG_CHANNEL_TYPE                = 800150;
  SendBirdError.MARK_AS_READ_RATE_LIMIT_EXCEEDED  = 800160;
  SendBirdError.QUERY_IN_PROGRESS                 = 800170;
  SendBirdError.ACK_TIMEOUT                       = 800180;
  SendBirdError.LOGIN_TIMEOUT                     = 800190;
  SendBirdError.WEBSOCKET_CONNECTION_CLOSED       = 800200;
  SendBirdError.WEBSOCKET_CONNECTION_FAILED       = 800210;
  SendBirdError.REQUEST_FAILED                    = 800220;

  // SendBirdError.NO_MESSAGE_OWNER                  = 800160;
  // SendBirdError.UNREMOVABLE_MESSAGE               = 800170;

  /***********************************
   * SendBirdError Class
   ***********************************/
  function SendBirdError (){
    return;
  };

  /***********************************
   * SendBirdException Class
   ***********************************/
  var SendBirdException = function (_message, _code) {

    /***********************************
     SendBirdException Class Construct
     **********************************/
    this.code = _code ? _code : 0;
    this.message = _message;
    return this;
  };


  /***********************************
   * User Class Static
   ***********************************/
  User.NON_AVAILABLE = 'nonavailable';
  User.ONLINE = 'online';
  User.OFFLINE = 'offline';

  User.build = function (userId, nickname, profileUrl, isOnline, lastSeenAt) {
    return {
      user_id: userId,
      nickname: nickname,
      profile_url: profileUrl,
      is_online: isOnline,
      last_seen_at: lastSeenAt
    };
  };

  /***********************************
   * User Class
   ***********************************/
  function User(jsonObject) {
    this.nickname = '';
    this.profileUrl = '';
    this.userId = '';
    // this.online = false;
    this.connectionStatus;
    this.lastSeenAt = null;

    var sInstance = this;

    if (!jsonObject) {
      return this;
    }

    // Parse JSON User Data
    try {
      // this.userId = String(jsonObject['user_id']);

      if (jsonObject.hasOwnProperty('guest_id')) {
        this.userId = String(jsonObject['guest_id']);
      }

      if (jsonObject.hasOwnProperty('user_id')) {
        this.userId = String(jsonObject['user_id']);
      }

      if (jsonObject.hasOwnProperty('name')) {
        this.nickname = String(jsonObject['name']);
      }

      if (jsonObject.hasOwnProperty('nickname')) {
        this.nickname = String(jsonObject['nickname']);
      }

      if (jsonObject.hasOwnProperty('image')) {
        this.profileUrl = String(jsonObject['image']);
      }

      if (jsonObject.hasOwnProperty('profile_url')) {
        this.profileUrl = String(jsonObject['profile_url']);
      }

      if (jsonObject.hasOwnProperty('is_online')) {
        this.connectionStatus = (jsonObject['is_online']) ? User.ONLINE : User.OFFLINE;
      } else {
        this.connectionStatus = User.NON_AVAILABLE;
      }

      if (jsonObject.hasOwnProperty('last_seen_at')) {
        this.lastSeenAt = parseInt(jsonObject['last_seen_at']);
      } else {
        this.lastSeenAt = 0;
      }
    } catch (e) {
      console.error(e);
    }
    return this;
  };


  /***********************************
   * UserListQuery Class Static
   ***********************************/
  UserListQuery.ALL_USER = 'alluser';
  UserListQuery.BLOCKED_USER = 'blockeduser';
  UserListQuery.PARTICIPANT = 'participant';
  UserListQuery.MUTED_USER = 'muteduser';
  UserListQuery.BANNED_USER = 'banneduser';

  /***********************************
   * UserListQuery Class
   ***********************************/
  function UserListQuery (_queryType, _channel) {
    var queryType;
    var channel;
    var jsonArrayName;
    var token = "";
    var queryInstance = this;

    this.hasNext = true;
    this.limit = 20;
    this.isLoading = false;

    /**
     * Request next query result.
     * @param handler UserListQueryResultHandler
     */
    this.next = function (cb) {
      if (!queryInstance.hasNext) {
        if (cb) {
          cb([], null);
        }
        return;
      }

      if (queryInstance.isLoading) {
        if (cb) {
          cb(null, new SendBirdException("Query in progress.", SendBirdError.QUERY_IN_PROGRESS));
        }
        return;
      }

      queryInstance.isLoading = true;
      var APIClientHandler = function(response, error){
        if (error) {
          queryInstance.isLoading = false;

          if (cb) {
            cb(null, error);
          }
          return;
        }

        token = response['next'];
        if (!token) {
          queryInstance.hasNext = false;
        }

        var userObjs = response[jsonArrayName];
        var users = [];

        for (var i in userObjs) {
          if (_queryType == UserListQuery.BANNED_USER) {
            users.push(new User(userObjs[i].user));
          } else {
            users.push(new User(userObjs[i]));
          }
        }

        queryInstance.isLoading = false;
        if (cb) {
          cb(users, null);
        }
      };

      switch(queryType) {
        case UserListQuery.ALL_USER:
          APIClient.getInstance().loadUserList(token, queryInstance.limit, APIClientHandler);
          break;

        case UserListQuery.BLOCKED_USER:
          if (!self.SendBird.currentUser) {
            if (cb) {
              cb(null, new SendBirdException("Connection must be made before you request the list.", SendBirdError.INVALID_INITIALIZATION));
            }
            return;
          }
          APIClient.getInstance().loadBlockedUserList(self.SendBird.currentUser.userId, token, queryInstance.limit, APIClientHandler);
          break;

        case UserListQuery.PARTICIPANT:
          APIClient.getInstance().loadOpenChannelParticipantList(channel.url, token, queryInstance.limit, APIClientHandler);
          break;

        case UserListQuery.MUTED_USER:
          APIClient.getInstance().loadOpenChannelMutedList(channel.url, token, queryInstance.limit, APIClientHandler);
          break;

        case UserListQuery.BANNED_USER:
          APIClient.getInstance().loadOpenChannelBanList(channel.url, token, queryInstance.limit, APIClientHandler);
          break;
      }
    };

    /**
     * Constructor
     */
    if (_channel) {
      channel = _channel;
    }

    queryType = _queryType;
    switch (queryType) {
      case UserListQuery.ALL_USER:
      case UserListQuery.BLOCKED_USER:
        jsonArrayName = 'users';
        break;

      case UserListQuery.PARTICIPANT:
        jsonArrayName = 'participants';
        break;
      case UserListQuery.MUTED_USER:
        jsonArrayName = 'muted_list';
        break;

      case UserListQuery.BANNED_USER:
        jsonArrayName = 'banned_list';
        break;
    }
  };


  /***********************************
   * UserMessage Class Static
   ***********************************/
  UserMessage.build = function (requestId, msgId, user, channel, message, data, createdAt) {
    var obj = {};
    obj['req_id'] = requestId;
    obj['msg_id'] = msgId;
    obj['channel_url'] = channel.url;
    obj['channel_type'] = channel.channelType == BaseChannel.CHANNEL_TYPE_OPEN ? BaseChannel.CHANNEL_TYPE_OPEN : BaseChannel.CHANNEL_TYPE_GROUP;
    obj['ts'] = createdAt;

    obj['message'] = message;
    if (data) {
      obj['data'] = data;
    }

    var userObj = {};
    userObj['user_id'] = user.userId;
    userObj['nickname'] = user.nickname;
    userObj['profile_url'] = user.profileUrl;

    obj['user'] = userObj;
    return obj;
  };

  /***********************************
   * UserMessage Class
   ***********************************/
  function UserMessage(jsonObject) {
    var childBase = new BaseMessage(jsonObject);
    childBase.messageType = BaseMessage.MESSAGE_TYPE_USER;

    childBase.message;
    childBase.data;
    childBase.sender;
    childBase.reqId;

    /**************************************
     * Constructor
     */
    if (!jsonObject) {
      return childBase;
    }

    childBase.message = String(jsonObject['message']);
    childBase.data = jsonObject.hasOwnProperty("data") ? String(jsonObject['data']) : "";
    childBase.sender = new User(jsonObject["user"]);
    childBase.reqId = jsonObject.hasOwnProperty("req_id") ? String(jsonObject["req_id"]) : "";

    return childBase;
  };


  /***********************************
   * WSClient Class Static Method
   ***********************************/
  WSClient.WSClientHandler = function () {
    this.isOpened = false;

    this.onReady = function () {
      //console.log('WSClientHandler.onReady');
    };

    this.onOpen = function () {
      //console.log('WSClientHandler.onOpen');
    };

    this.onClose = function () {
      //console.log('WSClientHandler.onClose');
    };

    this.onErrorClose = function () {
      //console.log('WSClientHandler.onErrorClose');
    };

    this.onMessage = function () {
      //console.log('WSClientHandler.onMessage');
    };

    this.onError = function () {
      //console.log('WSClientHandler.onError');
    };

    // Reconnect
    this.onReconnectFailed = function () {
      //console.log('WSClientHandler.onReconnectFailed');
    };

    this.onReconnectStarted = function () {
      //console.log('WSClientHandler.onReconnectStarted');
    };

    this.onReconnectSucceeded = function () {
      //console.log('WSClientHandler.onReconnectSucceeded');
    };

    return this;
  };


  /***********************************
   * WSClient Class
   ***********************************/
  function WSClient(_appId, _sdkVersion, _sessionKey, WSClientHandler) {
    this.appId = _appId;
    this.SDKVersion = _sdkVersion;
    this.sessionKey = _sessionKey ? _sessionKey : '';
    // //console.log('WSClient sessionKey:', this.sessionKey);

    var sInstance = this;
    var explicitDiconnect = false;

    var reconnectDelay = 3 * 1000;
    var reconnectCount = 0;
    var reconnectCountLimit = 5;
    var reconnectHandler;

    var ws;
    var lastActiveMillis = 0;

    var connectUser;
    var connectWSHost;
    var connectHandler;

    var isReconnectFlow = false;

    // TODO: clearWebSocket();

    if (!WSClientHandler) {
      debug.error('WSClientHandler undefined');
      WSClientHandler = new WSClient.WSClientHandler();
    }

    var active = function () {
      lastActiveMillis = new Date().getTime();
    };

    var reconnectInitialize = function () {
      reconnectDelay = 3 * 1000;
      reconnectCount = 0;
    };
    reconnectInitialize();

    this.getConnectionState = function () {
      if (ws.readyState == 1) {
        return self.SendBird.connectionState['OPEN'];
      }
      return self.SendBird.connectionState['CLOSED'];
    };

    var _pinger = function (timeoutHandler) {
      // TODO: ping interval set 15sec
      var pingInterval = 15 * 1000;
      // var pingInterval = 5 * 1000; // test interval
      var pingTimeoutTime = 2 * 1000;

      var pingTimer;
      var pingTimeoutTimer;

      this.ping = function () {
        this.stop();
        pingTimer = setTimeout(function () {
          var ping = Command.bPing();
          sInstance.send(ping);

          pingTimeoutTimer = setTimeout(function () {
            timeoutHandler();
          }, pingTimeoutTime);
        }, pingInterval);
      };

      this.stop = function () {
        clearTimeout(pingTimer);
        clearTimeout(pingTimeoutTimer);
      };
    };


    var reconnect = function () {
      // ping / pong timeout
      //console.log('reconnect start:', reconnectCount, reconnectDelay);
      sInstance.disconnect(false);

      if (!isReconnectFlow) {
        WSClientHandler.onReconnectStarted();
        isReconnectFlow = true;
      }

      if (reconnectCount == reconnectCountLimit) {
        WSClientHandler.onReconnectFailed();
      } else {
        clearTimeout(reconnectHandler);
        reconnectHandler = setTimeout(function () {
          //console.log('reconnect execute');
          sInstance.connect(connectUser, connectWSHost);

          reconnectCount++;
          reconnectDelay *= 2;

        }, reconnectDelay);
      }
    };
    var pinger = new _pinger(reconnect);

    this.connect = function (_user, _WSHost, _connectHandler) {
      connectUser = _user;
      connectWSHost = _WSHost;
      connectHandler = _connectHandler;

      try {
        var _WS = typeof WebSocket === 'undefined' ? require('websocket').w3cwebsocket : WebSocket;
      } catch (err) {
        var _WS = WebSocket;
      }

      try {
        var WS_URL_PARAM = '/?p=JS&pv=' + self.OSVersion + '&sv=' + self.SDKVersion + '&ai=' + this.appId + '&key=' + self.APIClient.sessionKey;
        // //console.log('WS_URL_PARAM:', WS_URL_PARAM);
        ws = new _WS(connectWSHost + WS_URL_PARAM);
      } catch (e) {
        //console.log('WebSocket Connection Error:', e);
        if (connectHandler) {

          connectHandler(null, e);
        }
        return;
      }

      ws.onopen = function (e) {
        //console.log('WSClient WebSocket onOpen');
        pinger.ping();

        // must be call before connectHandler
        if (!isReconnectFlow) {
          WSClientHandler.onOpen(e);
        } else {

          // TODO: openchannel auto join
          for (var i in OpenChannel.enteredChannels) {
            var channel = OpenChannel.enteredChannels[i];
            channel.enter();
          }

          WSClientHandler.onReconnectSucceeded();
          reconnectInitialize();
        }

        if (!isReconnectFlow && connectHandler) {
          connectHandler(connectUser);
        }
      };

      ws.onmessage = function (e) {
        // //console.log('ws.onmessage', e);

        active();

        var data = e['data'].split('\n');
        for (var i in data) {
          var item = data[i];
          if (!item || typeof item != 'string') continue;

          try {
            var command = item.substring(0, 4);
            if (command == 'PONG') {
              // //console.log('PONG!');
              pinger.ping();
              continue;
            }
          } catch (e) {
            //console.log(e);
          }

          WSClientHandler.onMessage(item);
        }
      };

      ws.onclose = function (e) {
        //console.log('WSClient ws.onclose', e);
        if (explicitDiconnect) {
          pinger.stop();
        } else {
          reconnect();
        }
        WSClientHandler.onClose(explicitDiconnect);
      };

      ws.onerror = function (e) {
        //console.log('WSClient ws.onerror', e);
        WSClientHandler.onError(e);
      };
    };

    this.disconnect = function (explicit) {
      //console.log('WSClient disconnect called');
      pinger.stop();

      if (typeof explicit == 'undefined' || explicit == true) {
        explicitDiconnect = true;
      } else {
        explicitDiconnect = false;
      }

      ws.close();
      if (explicitDiconnect) {
        WSClientHandler.onClose();
      } else {
        WSClientHandler.onErrorClose();
      }
    };

    this.send = function (command, cb) {
      // //console.log('send called: ', command.encode());
      if (ws.readyState != 1) {
        //console.log('ws send error. readyState not 1')
        if (cb) {
          cb(null, new SendBirdException("WS connection closed.", SendBirdError.WEBSOCKET_CONNECTION_CLOSED));
        }
      } else {
        // //console.log('ws.send: ', command.encode());
        ws.send(command.encode());
        if (cb) {
          cb(null);
        }
      }
    };

    return this;
  };


  /***********************************************
   * SendBird3 Constructor
   ***********************************************/
  var self = this;

  self.WSClient = null;
  self.APIClient = null;

  // var DEBUG = true;
  var DEBUG = false;
  // var DEBUG_HOST = true;
  var DEBUG_HOST = false;

  var WS_HOST = 'wss://ws.sendbird.com';
  var API_HOST = 'https://api.sendbird.com';

  var DEBUG_WS_HOST = 'ws://localtest.me:9000';
  var DEBUG_API_HOST = 'http://localtest.me:8000/api';
  // var DEBUG_WS_HOST = 'ws://192.168.0.5:9000';
  // var DEBUG_API_HOST = 'http://192.168.0.5:8000/api';

  if (DEBUG_HOST) {
    WS_HOST = DEBUG_WS_HOST;
    API_HOST = DEBUG_API_HOST;
  }

  var appId = '';
  var reconnectDelay = 3000;
  var reconnectCount = 0;
  // var APIClient;

  try {
    var console = window.console || {
        log: function () {
        }
      };
  } catch (e) {
    var console = {
      log: function () {
      }
    };
  }

  var debug = {
    log: function (message, message2) {
      if (DEBUG) {
        if (message2) {
          //console.log('[DEBUG] ', message, message2);
        } else {
          //console.log('[DEBUG] ', message);
        }
      }
    },
    error: function (message) {
      //console.log('[ERROR] ' + message);
    }
  };

  try {
    if (!initParams.hasOwnProperty('appId')) {
      //console.log('Must be set appId');
      return {};
    }
  } catch (e) {
    //console.log('Must be set appId');
    return {};
  }

  try {
    self.OSVersion = navigator.userAgent.replace(/,/g, '.');
  } catch (e) {
    self.OSVersion = 'undefined';
  }
  self.SDKVersion = '3.0.0';
  self.appId = initParams['appId'];

  self.SendBird = new SendBird(initParams);
  return self.SendBird;
});
