import express from "express";
import ProductManager from "../ProductManager.js"
import CartManager from "../CartManager.js";

export const cartRouter = express.Router();
const cartManager = new CartManager("./src/carts.json");

const productManager = new ProductManager("./src/products.json");

cartRouter.post('/', async (req, res) => {
    const result = await cartManager.addCart();
    res.send(result);
})
cartRouter.get('/:cid', async (req, res) => {
    const id = parseInt(req.params.cid);
    const result = await cartManager.getCartById(id);
    res.status(200).send({result});
})

cartRouter.get('/', async (req, res) => {
    const countLimit = parseInt(req.query.limit);
    const carts = await cartManager.getCarts();
    if(countLimit){
        const result = carts.slice(0, countLimit);
        return res.status(200).send({result});
    } else return res.status(200).send({carts}); 
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const cart = await cartManager.getCartById(cartId);
    const product = await productManager.getProductById(productId);
    if (cart && product){
        const newData = await cartManager.updateCart(cartId, {products: {ProductID: productId, quantity: 1}});
        res.send(newData);
    }
})


