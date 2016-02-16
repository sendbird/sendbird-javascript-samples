
var nickname = '';

$('#user_nickname').change(function() {
  nickname = $('#user_nickname').val().replace(/ /gi, '');
});

$('#btn_start').click(function() {
  if (nickname.isEmpty()) {
    alert('Please enter user nickname');
    return;
  }
  window.location.href = 'chat.html?nickname=' + encodeURI(encodeURIComponent(nickname));
});

$(document).ready(function() {
  $('#user_nickname').val('');
  $('#user_nickname').focus();
});