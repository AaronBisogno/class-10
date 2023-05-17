import * as fs from "fs";

export class ProductManager {

    constructor(path){
        this.path = path;
        this.products = [];
        this.id = 0;

        if (fs.existsSync(path)) {
            const productsString = fs.readFileSync(this.path, "utf-8")
            const productsFile = JSON.parse(productsString)
            this.products = productsFile
        } else {
            fs.writeFileSync(path, "[]")
            this.products = []
        }
    }

    async addProduct(product){
        const { title, description, code, price, status, stock, category, thumbnails} = product;
        if (title && description && price && code && stock && category) {
            const codeValid = this.products.find(p => p.code == code);
            if (codeValid) {
                return(`Product already exists.`);
            }  else {
                const lastProduct = this.products[this.products.length - 1];
                this.id = lastProduct ? lastProduct.id + 1 : 1;
                product.id = this.id;
                product.status = true;
                this.products.push(product)
                await fs.promises.writeFile(this.path, JSON.stringify(this.products));
                return `The product "${product.title}" was added successfully.`;
    }
        } else {
            return (`ERROR, Product data is missing or is a different type of data.`);
        }
    }

    async getProducts(){
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const products = JSON.parse(data);
        return(products)
    }

    async getProductById(id){
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const products = JSON.parse(data);
        const productForId = products.find(p => p.id === id)
        if(productForId){
            return(productForId)
        } else return("Product not found.")
    }

    async updateProduct(id, updateData) {
        const productIndex = this.products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            const updatedProduct = { ...this.products[productIndex], ...updateData };
            this.products[productIndex] = updatedProduct;
            await fs.promises.writeFile(this.path, JSON.stringify(this.products))
            return `The product "${updatedProduct.title}" was updated successfully.`
        } else {
            return("Product not found.");
        }
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            return("Product not found.");
        } else{
            const product = this.products[index];
            this.products.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products));
            return `The product "${product.title}" was deleted successfully.`;
        }
    
        
    }

    async deleteAll() {
        this.products = [];
        await fs.promises.writeFile(this.path, JSON.stringify(this.products))
        return `Products was deleted successful.`
    }
}

export default ProductManager;