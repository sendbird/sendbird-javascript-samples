const ANIMATION_EVENT = 'animationend';
const ANIMATION_REGEX = 'sb-fade.*';
const DISPLAY_NONE = 'none';
const DISPLAY_BLOCK = 'block';

var hasClassRegex = (target, classNameRegex) => {
  return new RegExp('(^| )' + classNameRegex + '( |$)', 'gi').test(target.className);
};

export function hide(target) {
  if (target) {
    if (hasClassRegex(target, ANIMATION_REGEX)) {
      let hideAnimationEvent;
      target.addEventListener(
        ANIMATION_EVENT,
        (hideAnimationEvent = function() {
          target.style.cssText += `display: ${DISPLAY_NONE};`;
          target.removeEventListener(ANIMATION_EVENT, hideAnimationEvent, false);
        })
      );
    } else {
      target.style.cssText += `display: ${DISPLAY_NONE};`;
    }
  }
}

export function show(target, displayType) {
  if (target) {
    target.style.cssText += `display: ${displayType ? displayType : DISPLAY_BLOCK}`;
  }
}

export function hasClass(...args) {
  return args.reduce((target, className) => {
    if (target.classList) {
      return target.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(target.className);
    }
  });
}

export function addClass(...args) {
  return args.reduce((target, className) => {
    if (target.classList) {
      if (!(className in target.classList)) {
        target.classList.add(className);
      }
    } else {
      if (target.className.indexOf(className) < 0) {
        target.className += ' ' + className;
      }
    }
    return target;
  });
}

export function removeClass(...args) {
  return args.reduce((target, className) => {
    if (target.classList) {
      target.classList.remove(className);
    } else {
      target.className = target.className.replace(
        new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
        ''
      );
    }
    return target;
  });
}

export function isEmptyString(target) {
  return !!(target == null || target == undefined || target.length == 0);
}

export function removeWhiteSpace(target) {
  return target.replace(/ /g, '');
}

export function getFullHeight(target) {
  var height = target.offsetHeight;
  var style = getComputedStyle(target);
  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
}

export function insertMessageInList(target, index, item) {
  return target.splice(index, 0, item);
}

export function getLastItem(target) {
  return target.length < 1 ? null : target[target.length - 1];
}

export function xssEscape(target) {
  if (typeof target === 'string') {
    return target
      .split('&')
      .join('&amp;')
      .split('#')
      .join('&#35;')
      .split('<')
      .join('&lt;')
      .split('>')
      .join('&gt;')
      .split('"')
      .join('&quot;')
      .split("'")
      .join('&apos;')
      .split('+')
      .join('&#43;')
      .split('-')
      .join('&#45;')
      .split('(')
      .join('&#40;')
      .split(')')
      .join('&#41;')
      .split('%')
      .join('&#37;');
  } else {
    return target;
  }
}

export function createNotificationSound() {
  var sound = document.createElement('audio');
  sound.style.cssText += `display: none;`;
  sound.id = 'notifierSound';
  sound.src = 'https://dxstmhyqfqr1o.cloudfront.net/sound/SendBird-default.mp3';
  return sound;
}

export function requestNotification() {
  const userAgent = window.navigator.userAgent;
  const msie = userAgent.indexOf('Trident/');
  const edge = userAgent.indexOf('Edge/');
  if (msie < 0 && edge < 0) {
    if (window.Notification && Notification.permission !== 'granted') {
      Notification.requestPermission(function(permission) {
        if (Notification.permission !== permission) {
          Notification.permission = permission;
        }
      });
    }
  }
}

export function setCookie(userId, nickname) {
  var date = new Date();
  date.setDate(date.getDate() + 1);
  var expires = date.toGMTString();
  document.cookie = 'sendbirdUserId=' + userId + ';expires=' + expires;
  document.cookie = 'sendbirdNickname=' + nickname + ';expires=' + expires;
}

export function getCookie() {
  var sendbirdUserInfo = {
    userId: '',
    nickname: ''
  };
  var cUserId = 'sendbirdUserId=';
  var cNickname = 'sendbirdNickname=';
  var cList = document.cookie.split(';');
  for (var i = 0; i < cList.length; i++) {
    var c = cList[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(cUserId) === 0) {
      sendbirdUserInfo['userId'] = c.substring(cUserId.length, c.length);
    } else if (c.indexOf(cNickname) === 0) {
      sendbirdUserInfo['nickname'] = c.substring(cNickname.length, c.length);
    }
  }
  return sendbirdUserInfo;
}

export function deleteCookie() {
  const userInfo = getCookie();
  if (userInfo.userId) {
    document.cookie = 'sendbirdUserId=' + userInfo.userId + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'sendbirdNickname=' + userInfo.nickname + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}
