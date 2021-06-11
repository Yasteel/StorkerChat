const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port =   process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) =>
{
  console.log('New Client Connected');

  socket.emit('welcomeMessage', 'Welcome to Socket.IO Test Application MF');

  socket.on('joinRoom' , (user) =>
  {
    socket.join(user.roomId);

    socket.on('newMessage', (message) =>
    {
      console.log('New Message');
      io.to(user.roomId).emit('newMessage', message);
    });

  });

  socket.on('disconnect', () =>
  {
    io.emit('leftChat', 'User Has Left');
  });
})


server.listen(port, () =>
{
  console.log(`Listening on port ${port}`);
});
