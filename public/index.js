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
    const socket = io.connect('http://localhost:8080');

    // On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
    const pseudo = prompt('Quel est votre pseudo ?');

    socket.emit('nouveau_client', pseudo);
    document.title = pseudo + ' - ' + document.title;

    // Quand on reçoit un message, on l'insère dans la page
    socket.on('message', (data) => {
      insereMessage(data.pseudo, data.message);
    });

    // Quand un nouveau client se connecte, on affiche l'information
    socket.on('nouveau_client', (pseudo)=> {
      const content = document.createTextNode(pseudo + ' a rejoint le Chat !');
      const elNewP = document.createElement('div');

      elZoneChat.appendChild(elNewP);
      elNewP.appendChild(content);
      //document.body.insert(elNewP, elZoneChat);
    });

    elMessage.addEventListener ('keypress', (e) => {
      if (e.keyCode === 13) {
        let message = elMessage.value;

        socket.emit('message', message); // Transmet le msg aux autres
        insereMessage(pseudo, message); // Affiche le msg aussi sur notre page
        elMessage.value = ''; // Vide la zone
        elMessage.value.focus(); // remet le focus dessus
      }
    });

    function insereMessage (pseudo, message) {
      const msgContent = document.createTextNode (message);
      const msgPseudo = document.createTextNode(pseudo + ' : ');
      const elNewP = document.createElement('p');
      const elNewB = document.createElement('b');

      elZoneChat.appendChild(elNewP);
      elNewP.appendChild(elNewB);
      elNewB.appendChild(msgPseudo);
      elNewP.appendChild(msgContent);
      document.body.insert(elNewP, elZoneChat);
    }
  }
}

const chat = new Chat();

chat.run();
