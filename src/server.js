import express from "express";
import handlebars from "express-handlebars";
import { Server, Socket } from "socket.io";
import { __dirname } from "./utils.js"
import viewsRouter from "./routes/index.js";
import apiRouter from "./routes/api-router.js";
import { productsManager } from "./managers/ProductManager.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', express.static(__dirname + "/public"));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + "/views")

app.use('/realtimeproducts', viewsRouter);
app.use('/api', apiRouter);

const httpServer = app.listen(8080, '0.0.0.0', ()=>{
  console.log("Servidor escuchando en puerto 8080");
})

app.get('/', async (req, res) => {
  const products = await productsManager.getProducts();
  console.log(products);
  res.render('home', {products})
})

const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket)=>{
  
  socketServer.emit('products', await productsManager.getProducts());
  
  socket.on('deleteProduct', async ({prodId})=>{
    await productsManager.hardDeleteProduct(prodId);
    socketServer.emit('products', await productsManager.getProducts());
  });

  socket.on('newProduct', async({product})=>{
    await productsManager.addProduct(product);
    socketServer.emit('products', await productsManager.getProducts());
  });
})