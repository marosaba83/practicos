// const socket = io.connect();

function enviarProducto() {
  const title = document.getElementById("nombre").value;
  const price = document.getElementById("precio").value;
  const thumbnail = document.getElementById("foto").value;
  socket.emit('productoNuevo', { title, price, thumbnail });
  return false;
}

socket.on('productos', productos => {
  let productosContenedor = '';
  productos && productos.length > 0 && productos.forEach(producto => {
    productosContenedor += `
      <div class="row">
        <div class="col">${producto.title}</div>
        <div class="col">${producto.price}</div>
        <div class="col">${producto.thumbnail}</div>
      </div>
    `;
  });
  document.getElementById('productosContenedor').innerHTML = productosContenedor;  
});
