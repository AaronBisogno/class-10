import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import { cartRouter } from './routes/carts.routes.js';
import { productsRouter } from './routes/products.routes.js';
import {Server} from 'socket.io';
import viewsRouter from './routes/views.routes.js';
import ProductManager from './ProductManager.js';

const app = express();
const port = 8080;
const productManager = new ProductManager("./src/products.json")
const httpServer = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${port}`)
});
const socketServer = new Server(httpServer);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('*', (req, res) =>{
    res.status(404).send({msg: "Route not found"});
})

socketServer.on('connection', (socket) => {
    console.log(`New client connected ${socket.id}`);
    socket.on('new-Product', async (newProduct) => {
        await productManager.addProduct(newProduct)
        const products = await productManager.getProducts();
        socketServer.emit('products', products);
    });
    socket.on('delete-Product', async (productId) => {
        await productManager.deleteProduct(productId);
        const products = await productManager.getProducts();
        socketServer.emit('products', products);
    });
  });

