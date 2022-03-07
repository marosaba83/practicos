const socket = io.connect();

function enviarMensaje() {
  const autor = document.getElementById('autor').value;
  const texto = document.getElementById('texto').value;
  console.log({ autor, texto })
  socket.emit('mensajeNuevo', { autor, texto });
  return false;
}

socket.on('mensajes', mensajes => {
  console.log(mensajes);
  let contMensajesHtml = '';
  mensajes.forEach(mensaje => {
    contMensajesHtml += `<span><b>${mensaje.autor}: </b>${mensaje.texto}</span><br>`;
  });
  document.getElementById('contenedorMsjs').innerHTML = contMensajesHtml;  
});
