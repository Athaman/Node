var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  usernames = [];


server.listen(process.env.PORT || 3000);
console.log("Server is running ...");
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/css/style.css', function(req, res){
  res.sendFile(__dirname + '/css/style.css');
});

app.get('/js/script.js', function(req, res){
  res.sendFile(__dirname + '/js/script.js');
});

io.sockets.on('connection', function(socket){
  console.log('Socket opened...');

  // log a user in
  socket.on('new user', function(data, callback){
      if(usernames.indexOf(data) !== -1){
        callback(false);
      } else{
        callback(true);
        socket.username = data;
        usernames.push(socket.username);
        updateUsernames();
      }
  });

  // update usernames
  function updateUsernames(){
    io.sockets.emit('usernames', usernames);
  }

  // send some messages
  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg: data, user:socket.username});
  });

  // disconnect a user
  socket.on('disconnect', function(data){
    if(!socket.username){
      return;
    }

    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
  });
});
