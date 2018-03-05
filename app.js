const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const path = require('path');
const request = require('request');

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
    socket.broadcast.emit('message', {'pseudo': socket.pseudo, 'message': message});
  });

  socket.on('messageytb', message => {
    const tabVideos = [];

    request({'url': `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${message}&key=AIzaSyBzhXQGlpp20V71dGCT_67REdUlWe-Gpog`, 'json': true}, (err, res, json)=> {
      if (err) {
        throw err;
      }

      for (let i = 0; i < 3; i ++) {
        tabVideos.push({'id': json.items[i].id.videoId, 'title': json.items[i].snippet.title, 'channelTitle': json.items[i].snippet.channelTitle, 'thumbnails': json.items[i].snippet.thumbnails.default.url});
      }
      socket.emit('messageytb', {'pseudo': socket.pseudo, 'message': tabVideos});
    });
  });

  socket.on('messageCarrefour', message => {
    

    request({url: 'https://api.fr.carrefour.io/v1/openapi/stores', json: true}, function(err, res, json) {
      if (err) {
        throw err;
      } else {
        const appCredentials = {
          "id_client" : "98cc4890-9c5b-4a9c-b2d9-3c9fdf7c4c18",
          "secret"    : "C1yD0eY7sT2yL8sJ4yR4tX5fW7eP7tV1dC6qA7fX4aU1gQ8oX8"
        }

        //var request = require("request");
        const options = { method: 'GET',
          url: 'https://api.fr.carrefour.io/v1/openapi/stores',
          qs: { 
            longitude: message[1],
            latitude: message[0],
            radius: '15000',
          },
          headers: { 
            accept: 'application/json',
            'x-ibm-client-secret': appCredentials.secret,
            'x-ibm-client-id':  appCredentials.id_client
          } 
        };

        request(options, function (error, response, body) {
          if (error) return  socket.emit('messageCarrefour', 'error');
        
          else {
            const json = JSON.parse(body);
            for(var i=0; i < json.list.length; i++){
              socket.emit('messageCarrefour', {'addresse':json.list[i].address, 'banner':json.list[i].banner, 'city':json.list[i].city, 'gas_station':json.list[i].gas_station, 'drive':json.list[i].drive,'latitude':json.list[i].latitude, 'longitude':json.list[i].longitude});
            }   
          }
        });
      }
    });
  });
});

server.listen(8080);
