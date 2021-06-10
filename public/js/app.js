var socket = io();
var messageContainer = document.getElementsByClassName('messages')[0];

var {username, chatType, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});
//On Connection//
socket.on('welcomeMessage', (message) =>
{
  if(username)
  {
    $('#welcome_msg').text(`Welcome ${username}`);
  }

  if(chatType == 'Create Chat Room')
  {
    let roomId = socket.id;
    socket.emit('joinRoom', {username, roomId});
    showRoom(roomId);
  }

  if(room)
  {
    let roomId = room;
    socket.emit('joinRoom', {username, roomId});
    showRoom(roomId);
  }
});

socket.on('newMessage', (user) =>
{
  console.log('New Message');
  var message;
  if(user.username === username)
  {
    message = `<div class="message to"><div class="header"><p>${user.username}</p></div><div class="body"><p>${user.msg}</p></div></div>`;
  }
  else
  {
    message = `<div class="message from"><div class="header"><p>${user.username}</p></div><div class="body"><p>${user.msg}</p></div></div>`;
  }

  $('.messages').append(message);
  messageContainer.scrollTop = messageContainer.scrollHeight;

})


$('.btn_send').click(function()
{
  var msg = $('.msg_text').val();
  if(!msg)
  {
    alert('Cannot send an empty Message');
  }
  else
  {
    socket.emit('newMessage', {username, msg, room});
  }
  clearText();
});

$('.copy').click(function()
{
  copyText();
});

$('.msg_text').keypress((event) =>
{
  var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        $('.btn_send').click();
    }
})


function showRoom(room)
{
  $('.room_id').css('display', 'block');
  $('#room_id').val(room);
}

function clearText()
{
  $('.msg_text').val('');
  $('.msg_text').focus();
}

function copyText()
{
  var copyText = document.getElementById("room_id");
  copyText.select();
  document.execCommand("copy");
  alert('Room Code Copied');
}
