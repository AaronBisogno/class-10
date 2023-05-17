import express from 'express';
import ProductManager from "../ProductManager.js"

const viewsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

viewsRouter.get('/home', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products: products });
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products: products });
})
export default viewsRouter