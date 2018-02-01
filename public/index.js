  const el_zone_chat = document.querySelector("#zone_chat");
  const el_message = document.querySelector("#message");
  const el_newP = document.createElement("p");
  const el_newB = document.createElement("b");

  // Connexion à socket.io
  const socket = io.connect('http://localhost:8080');

  // On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
  const pseudo = prompt('Quel est votre pseudo ?');
  socket.emit('nouveau_client', pseudo);
  document.title = pseudo + ' - ' + document.title;

  // Quand on reçoit un message, on l'insère dans la page
  socket.on('message',(data) => {
    insereMessage(data.pseudo, data.message)
  })

  // Quand un nouveau client se connecte, on affiche l'information
  socket.on('nouveau_client', (pseudo)=> {

    const content = document.createTextNode(pseudo + ' a rejoint le Chat !\n');
    el_zone_chat.appendChild(el_newP);
    el_newP.appendChild(content);
    //document.body.insert(el_newP,el_zone_chat);
  })


            
el_message.addEventListener("keypress",(e) => {

  if(e.keyCode==13){
    let message = el_message.value;
    socket.emit('message', message); // Transmet le msg aux autres
    insereMessage(pseudo, message); // Affiche le msg aussi sur notre page
    el_message.value='';  // Vide la zone
    el_message.value.focus();  // remet le focus dessus
  }
});


function insereMessage(pseudo, message) {
                 
  const msgContent = document.createTextNode(message +'\n');
  const msgPseudo = document.createTextNode(pseudo+' : ');

  el_zone_chat.appendChild(el_newP);
  el_newP.appendChild(el_newB);
  el_newB.appendChild(msgPseudo);
  el_newP.appendChild(msgContent);

  document.body.insert(el_newP,el_zone_chat);
}
