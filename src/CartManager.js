import * as fs from "fs";

export class CartManager {

    constructor(path){
        this.path = path;
        this.carts = [];
        this.id = 0;

        if (fs.existsSync(path)) {
            const cartsString = fs.readFileSync(this.path, "utf-8")
            const cartsFile = JSON.parse(cartsString)
            this.carts = cartsFile
        } else {
            fs.writeFileSync(path, "[]")
            this.carts = []
        }
    }

    async addCart(cart){
        cart= {
            products : []
        }
        const lastCart = this.carts[this.carts.length - 1];
        this.id = lastCart ? lastCart.id + 1 : 1;
        cart.id = this.id;
        this.carts.push(cart)
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
        return `The cart "${cart.id}" was added successfully.`;
    }

    async getCarts(){
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const carts = JSON.parse(data);
        return(carts)
    }

    async getCartById(id){
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const carts = JSON.parse(data);
        const cartForId = carts.find(p => p.id === id)
        if(cartForId){
            return(cartForId)
        } else return("Cart not found.")
    }

    async updateCart(id, updateData) {
        const cartIndex = this.carts.findIndex(p => p.id === id);
        if (cartIndex !== -1) {
            const updatedCart = { ...this.carts[cartIndex], ...updateData };
            this.carts[cartIndex] = updatedCart;
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts))
            return `The Cart "${updatedCart.id}" was updated successfully.`
        } else {
            return("Cart not found.");
        }
    }

    async deleteCart(id) {
        const index = this.carts.findIndex(p => p.id === id);
        if (index === -1) {
            return("Cart not found.");
        } else{
            const cart = this.carts[index];
            this.carts.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
            return `The product "${cart.id}" was deleted successfully.`;
        }
    
        
    }

    async deleteAll() {
        this.carts = [];
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts))
        return `Carts was deleted successful.`
    }
}

export default CartManager;