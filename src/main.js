const express = require('express');


const { Server: Httperver } = require('http');
const { Server: IOServer } = require('socket.io');

// ** Memoria ** //
// const ProductsMemo = require('./api/productsMemo.js')
// const apiProducts = new ProductsMemo();

// ** File System ** //
// const ProductsFs = require('./api/productsFs.js')
// const apiProducts = new ProductsFs();

// ** SQL Lite 3 ** //
// const { optionSqlite } = require('./utils/sqlite');
// const ProductsDb = require('./api/productsDb.js')
// const apiProducts = new ProductsDb(optionSqlite);

// ** MongoDB ** //
// var mongo = require('mongodb');
// const ProductsMongo = require('./api/productsMongo.js')
// const apiProducts = new ProductsMongo();

const app = express();
const httpServer = new Httperver(app);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set("view engine", "ejs");
app.set("views", "./views");

app.post('/productos', (req, res) => {
  const product = req.body
  apiProducts.addProduct(product)
  res.redirect('/')
})

app.get('/productos', (req, res) => {
  const prods = apiProducts.listAll()
  res.render("view", {
    products: prods,
    productsLength: prods.length
  });
});

let mensajes = [];

// -- Socket -- //
const io = new IOServer(httpServer);

io.on('connection', socket => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);

  io.emit('productos', apiProducts.listAll());
  io.emit('mensajes', mensajes);

  socket.on('mensajeNuevo', mensaje => {
    console.log('Mensaje nuevo', socket.id, mensaje);
    mensajes.push(mensaje);
    io.sockets.emit('mensajes', mensajes);
  });

  socket.on('productoNuevo', product => {
    console.log('Producto nuevo', socket.id, product);
    apiProducts.addProduct(product);

    io.emit('productos', apiProducts.listAll());
    return false;
  });
})

const PORT = 8080
const server = httpServer.listen(PORT, () => {
  console.log(`HTTP Server in port: ${server.address().port}`)
})

server.on("error", error => console.log(`Error en servidor ${error}`))
