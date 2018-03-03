class Chat {
  constructor () {

  }

  init () {

  }

  run () {
    const elZoneChat = document.querySelector('#zone_chat');
    const elMessage = document.querySelector('#message');

    // Connexion à socket.io
    const io = require('socket.io-client');
    const socket = io.connect('http://localhost:8080')

    // On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
    const pseudo = prompt('Quel est votre pseudo ?');

    socket.emit('nouveau_client', pseudo);
    document.title = pseudo + ' - ' + document.title;

    // Quand on reçoit un message, on l'insère dans la page
    socket.on('message', (data) => {
      insereMessage(data.pseudo, data.message);
    });

    // Quand on reçoit un message avec /youtube, on l'insère dans la page
   /* socket.on('messageytb', (data) => {
      
      insereVideo(data.message[0].id);
    });*/

    socket.on('messageytb', (data) => {

      let DOM = "";
      const elNewDiv = document.createElement('div');


      data.message.forEach(function(element) {

        const elNewDiv2 = document.createElement('div');
          elNewDiv2.setAttribute("class", "descVideo");

        const elNewImg = document.createElement('img');
        elNewImg.setAttribute("src", element.thumbnails);
        elNewImg.setAttribute("id", element.id);
        elNewImg.setAttribute("class", "thumbnails");
        const elNewP= document.createElement('p');
        const elNewSpan = document.createElement('span');


        const title = document.createTextNode (element.title);
        const chanel = document.createTextNode (element.channelTitle);

        elNewP.appendChild(title);
        elNewSpan.appendChild(chanel);
        elNewDiv2.appendChild(elNewImg);
        elNewDiv2.appendChild(elNewP);
        elNewDiv2.appendChild(elNewSpan);

        //elNewDiv2.appendChild(content);
        elNewDiv.appendChild(elNewDiv2);
      });
      elZoneChat.appendChild(elNewDiv);
    });

    // Quand un nouveau client se connecte, on affiche l'information
    socket.on('nouveau_client', (pseudo)=> {
      const content = document.createTextNode(pseudo + ' a rejoint le Chat !');
      const elNewDiv = document.createElement('div');

      elZoneChat.appendChild(elNewDiv);
      elNewDiv.appendChild(content);
      elZoneChat.scrollTop = elZoneChat.scrollHeight;
    });

    elMessage.addEventListener ('keypress', (e) => {
      if (e.keyCode === 13) {
        let message = elMessage.value;

        if (message.indexOf("/youtube")!= -1){
            message = message.substring(message.indexOf("/youtube")+9)
          socket.emit('messageytb', message);
        }
        else{
          socket.emit('message', message); // Transmet le msg aux autres
        }
        insereMessage(pseudo, message); // Affiche le msg aussi sur notre page
        elMessage.value = ''; // Vide la zone
        elMessage.focus(); // remet le focus dessus
      }
    });

    function insereMessage (pseudo, message) {
      const msgContent = document.createTextNode (message);
      const msgPseudo = document.createTextNode(pseudo + ' : ');
      const elNewDiv = document.createElement('div');
      const elNewB = document.createElement('b');

      elZoneChat.appendChild(elNewDiv);
      elNewDiv.appendChild(elNewB);
      elNewB.appendChild(msgPseudo);
      elNewDiv.appendChild(msgContent);
      elZoneChat.scrollTop = elZoneChat.scrollHeight;
    }

    function insereVideo (id) {

       //<div id="player"></div>
      const elNewIframe = document.createElement('iframe');
      elNewIframe.setAttribute("id", "player");
      elNewIframe.setAttribute("type", "text/html");
      elNewIframe.setAttribute("width", "640");
      elNewIframe.setAttribute("height", "360");
      elNewIframe.setAttribute("src", `http://www.youtube.com/embed/${id}`);

      elZoneChat.appendChild(elNewIframe);
    }

    //const test=document.querySelectorAll(.thumbnails);

  }
}

const chat = new Chat();

chat.run();
