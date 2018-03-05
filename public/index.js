class Chat {
  constructor () {

  }

  init () {

  }

  run () {
    const elZoneChat = document.querySelector('#zone_chat');
    const elMessage = document.querySelector('#message');

    // Connexion socket.io
    const io = require('socket.io-client');
    const socket = io.connect('http://localhost:8080');

    // ask a pseudo for a new connection and send in a title
    const pseudo = prompt('Quel est votre pseudo ?');

    //send new user pseudo
    socket.emit('nouveau_client', pseudo);
    document.title = `${pseudo} - ${document.title}`;

    // receive a normal message
    socket.on('message', data => {
      insereMessage(data.pseudo, data.message);
    });


    socket.on('messageCarrefour', data => {
      selectionCarrefour(data); 
    });

    socket.on('messageytb', data => {
      selectionVideo(data);
    });

    // send a new user log
    socket.on('nouveau_client', pseudo=> {
      const content = document.createTextNode(`${pseudo} a rejoint le Chat !`);
      const elNewDiv = document.createElement('div');

      elZoneChat.appendChild(elNewDiv);
      elNewDiv.appendChild(content);
      elZoneChat.scrollTop = elZoneChat.scrollHeight;
    });

    elMessage.addEventListener ('keypress', e => {
      if (e.keyCode === 13) {
        let message = elMessage.value;

        if (message.indexOf('/youtube') != - 1) {

          message = message.substring(message.indexOf('/youtube') + 9);
          socket.emit('messageytb', message);

        }else if (message.indexOf('/carrefour') != - 1){


          function getLocation() {
              if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(showPosition);
              }
          }

          function showPosition(position) {

            const positionGPS=[position.coords.latitude,position.coords.longitude];

            socket.emit('messageCarrefour', positionGPS);


          }
          getLocation();


        } else {
          socket.emit('message', message); // send message in other user
        }
        insereMessage(pseudo, message); // display a msg in our page
        elMessage.value = ''; // reset an area
        elMessage.focus(); // focus on a message area
      }
    });

    const insereMessage = (pseudo, message) => {
      const msgContent = document.createTextNode (message);
      const msgPseudo = document.createTextNode(`${pseudo}  : `);
      const elNewDiv = document.createElement('div');
      const elNewB = document.createElement('b');

      elZoneChat.appendChild(elNewDiv);
      elNewDiv.appendChild(elNewB);
      elNewB.appendChild(msgPseudo);
      elNewDiv.appendChild(msgContent);
      elZoneChat.scrollTop = elZoneChat.scrollHeight;
    };

    const selectionVideo= data => {

      const elNewDiv = document.createElement('div');

      data.message.forEach(element => {
        const elNewDiv2 = document.createElement('div');

        elNewDiv2.setAttribute('class', 'descVideo');

        const elNewImg = document.createElement('img');

        elNewImg.setAttribute('src', element.thumbnails);
        elNewImg.setAttribute('id', element.id);
        elNewImg.setAttribute('class', 'thumbnails');
        const elNewP = document.createElement('p');
        const elNewSpan = document.createElement('span');

        const title = document.createTextNode (element.title);
        const chanel = document.createTextNode (element.channelTitle);

        elNewP.appendChild(title);
        elNewSpan.appendChild(chanel);
        elNewDiv2.appendChild(elNewImg);
        elNewDiv2.appendChild(elNewP);
        elNewDiv2.appendChild(elNewSpan);

        elNewImg.addEventListener('click', e => {
          insereVideo(element.id);
        });

        elNewDiv.appendChild(elNewDiv2);
      });
      elZoneChat.appendChild(elNewDiv);
    }


    const insereVideo = id => {
      const elNewIframe = document.createElement('iframe');

      elNewIframe.setAttribute('id', 'player');
      elNewIframe.setAttribute('type', 'text/html');
      elNewIframe.setAttribute('width', '640');
      elNewIframe.setAttribute('height', '360');
      elNewIframe.setAttribute('src', `http://www.youtube.com/embed/${id}`);

      elZoneChat.appendChild(elNewIframe);
    };

    const selectionCarrefour= data => {
      alert(JSON.stringify(data));

      const elNewDiv = document.createElement('div');

      data.forEach(element => {   ///  ici
        const elNewDiv2 = document.createElement('div');

        elNewDiv2.setAttribute('class', 'descCarrefour');

        const elNewPAdresse = document.createElement('p');
        const elNewPBanner = document.createElement('p');
        const elNewPService = document.createElement('p');

        const elNewSpan = document.createElement('span');

        const adresse = document.createTextNode (element.addresse);
        const city = document.createTextNode (element.city);

        const banner = document.createTextNode (element.banner);

        const gas_station = document.createTextNode ('No gas station');
        if(element.gas_station =! 0) gas_station =document.createTextNode ('gas station');
       
        const drive = document.createTextNode ('No drive');
        if(element.drive != 0) drive =document.createTextNode ('drive');


        elNewPAdresse.appendChild(adresse);
        elNewPAdresse.appendChild(city);
        elNewPBanner.appendChild(banner);
        elNewPService.appendChild(gas_station);
        elNewPService.appendChild(drive);

        elNewDiv2.appendChild(elNewPAdresse);
        elNewDiv2.appendChild(elNewPBanner);
        elNewDiv2.appendChild(elNewPService);

        elNewDiv2.addEventListener('click', e => {
          insereCarrefourMap(element.latitude,element.longitude);
        });

        elNewDiv.appendChild(elNewDiv2);
      });
      elZoneChat.appendChild(elNewDiv);

    }

    const insereCarrefourMap = (latitude,longitude) => {
      alert(latitude);
      alert(longitude);

      const elNewIframe = document.createElement('iframe');

      elNewIframe.setAttribute('width', '600');
      elNewIframe.setAttribute('height', '450');
      elNewIframe.setAttribute('frameborder', '0');
      elNewIframe.setAttribute('style', 'border:0');
      elNewIframe.setAttribute('src', `https://www.google.com/maps/embed/v1/place?key=AIzaSyBzhXQGlpp20V71dGCT_67REdUlWe-Gpog&q=${latitude},${longitude}`);
      //elNewIframe.setAttribute('src', `https://www.google.com/maps/embed/v1/place?key=AIzaSyBzhXQGlpp20V71dGCT_67REdUlWe-Gpog&origine=${},${}&destination=${latitude},${longitude}`);
      //elNewIframe.setAttribute('allowfullscreen');

      elZoneChat.appendChild(elNewIframe);
    };
  }
}

const chat = new Chat();

chat.run();
