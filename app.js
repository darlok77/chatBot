const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const path = require('path');
const http = require('http');

app.use ('/', express.static(path.join(`${__dirname}/public`)));

// Chargement de la page index.html
app.get ('/', (req, res) => {
  res.sendfile('./index.html');
});

io.sockets.on('connection', socket => {
  // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
  socket.on('nouveau_client', pseudo => {
    socket.pseudo = pseudo;
    socket.broadcast.emit('nouveau_client', pseudo);
  });

  // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
  socket.on('message', message => {
    socket.broadcast.emit('message', {'pseudo': socket.pseudo, 'message': message + ' Normal'});
  });

  socket.on('messageytb', message => {

    const response = callApi('MTC-S3RL');
    socket.emit('messageytb', {'pseudo': socket.pseudo, 'message': response});
  });
});


const callApi = name =>{


  const options = {
    host: 'https://www.googleapis.com/youtube/v3',
    port: 80,
    path: '/search?part=snippet&q='+name+'&key=AIzaSyBzhXQGlpp20V71dGCT_67REdUlWe-Gpog',
    method: 'Get'
  };

 http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
}).end();

}
server.listen(8080);
