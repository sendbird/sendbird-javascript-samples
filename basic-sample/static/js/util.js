
String.prototype.isEmpty = function() {
  return !!(this == null || this == undefined || this.length == 0);
};

String.prototype.format = function () {
  var i = 0, args = arguments;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};

Array.prototype.pushUnique = function (item){
    if(this.indexOf(item) == -1) {
        this.push(item);        
    }
    return this.length;
};

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

function notifyMessage(message) {
  var iconUrl = location.protocol + '//' + location.host + '/static/img/sendbird-icon-120x120.png';
  if (window.Notification && Notification.permission === "granted") {
    var noti = new Notification("SendBird | " + currChannelUrl, {
      icon: iconUrl,
      body: message,
      tag: currChannelUrl
    });
    noti.onclick = function(){
      window.focus();
    }
  }
}

function isCurrentUser(guestId) {
  return (getGuestId()==guestId) ? true : false;
}

function checkGuestId() {
  var name = getGuestId();
  if (name.trim().length == 0) {
    return generateUUID();
  }
  return name;
}

function getGuestId() {
  var name = 'guest_id=';
  var ca = document.cookie.split(';');
  for (var i=0 ; i<ca.length ; i++) {
    var c = ca[i];
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
  return setCookieGuestId(uuid);
}

function setCookieGuestId(uuid) {
  document.cookie = "guest_id=" + uuid + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
  return uuid;
}

function nameInjectionCheck(name) {
  name = name.replace(/</g, '&lt;');
  name = name.replace(/>/g, '&gt;');
  return name;
}

function convertLinkMessage(msg) {
  var returnString = '';

  msg = msg.replace(/</g, '&lt;');
  msg = msg.replace(/>/g, '&gt;');

  var urlexp = new RegExp('(http|ftp|https)://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?', 'i');
  if (urlexp.test(msg)) {
    returnString += '<img src="/static/img/icon-link.svg" style="margin-right: 6px;"><a href="' + msg + '" target="_blank">' + msg + '</a>';
  } else {
    returnString += msg;
  }

  return returnString;
}
