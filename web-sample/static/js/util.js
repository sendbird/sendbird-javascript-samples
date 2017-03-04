
if (!XMLHttpRequest.prototype.sendAsBinary) {
  XMLHttpRequest.prototype.sendAsBinary = function(sData) {
    console.log(sData.length);
    var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
    for (var nIdx = 0; nIdx < nBytes; nIdx++) {
      ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
    }
    /* send as ArrayBufferView...: */
    console.log("before bin");
    this.send(ui8Data);
    console.log("after bin");
    /* ...or as ArrayBuffer (legacy)...: this.send(ui8Data.buffer); */
  };
}

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

if (typeof Array.prototype.forEach != 'function') {
    Array.prototype.forEach = function(callback){
      for (var i = 0; i < this.length; i++){
        callback.apply(this, [this[i], i, this]);
      }
    };
}

String.prototype.isEmpty = function() {
  return !!(this == null || this == undefined || this.length == 0);
};

String.prototype.format = function () {
  var i = 0, args = arguments;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};

// Array.prototype.pushUnique = function (item){
//     if(this.indexOf(item) == -1) {
//         this.push(item);
//     }
//     return this.length;
// };

function getUrlVars() {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

function notifyMe() {
  if (window.Notification && Notification.permission === "granted") {
    console.log("Notification is already granted.");
  } else if (window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status;
      }

      if (status === "granted") {
        console.log("Notification is granted.");
      } else {
        console.log("Notification is denied.");
      }
    });
  }
}

function notifyMessage(channel, message) {
  var iconUrl = location.protocol + '//' + location.host + '/static/img/sendbird-icon-120x120.png';
  if (window.Notification && Notification.permission === "granted") {
    var noti = new Notification("SendBird | " + channel.url, {
      icon: iconUrl,
      body: message,
      tag: channel.url
    });
    noti.onclick = function(){
      window.focus();
    }
  }
}

function isCurrentUser(userId) {
  return (getUserId()==userId) ? true : false;
}

function checkUserId(userId) {
  if (!userId) {
    userId = getUserId();
  } else {
    setCookieUserId(userId);
  }

  if (userId.trim().length == 0) {
    userId = generateUUID();
  }

  return userId;
}

function getUserId() {
  var name = 'user_id=';
  var ca = document.cookie.split(';');
  for (var i=0 ; i<ca.length ; i++) {
    var c = ca[i];
    if (!c) continue;
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) == 0) {
      return c.substring(name.length,c.length);
    }
  }
  return '';
}

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
}

function setCookieUserId(uuid) {
  document.cookie = "user_id=" + uuid + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
  return uuid;
}

function nameInjectionCheck(name) {
  try {
    name = name.replace(/</g, '&lt;');
    name = name.replace(/>/g, '&gt;');

    return name;
  } catch(e) {
    // console.log(e);
    return '';
  }
}

function convertLinkMessage(msg) {
  var returnString = '';

  try {
    msg = msg.replace(/</g, '&lt;');
    msg = msg.replace(/>/g, '&gt;');
  } catch(e) {
    msg = '';
  }

  var urlexp = new RegExp('(http|ftp|https)://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?', 'i');
  if (urlexp.test(msg)) {
    returnString += '<img src="/static/img/icon-link.svg" style="margin-right: 6px;"><a href="' + msg + '" target="_blank">' + msg + '</a>';
  } else {
    returnString += msg;
  }

  return returnString;
}
