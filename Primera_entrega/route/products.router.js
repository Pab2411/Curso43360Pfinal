import express from 'express';
import fs from 'fs';
import { Router } from 'express';
import { pathToFileURL } from 'url';

const router = Router();
const productsFilePath = './archivoHL/productos.json'

class Product {
    constructor({ title, description, code, price, status = true, stock, category, thumbnails }) {
        this.title = String(title);
        this.description = String(description);
        this.code = String(code);
        this.price = Number(price);
        this.status = status;
        this.stock = Number(stock);
        this.category = String(category);
        this.thumbnails = thumbnails;
    }
}

// todos los productos y opcion a cantidad

router.get('/', async (req, res) => {
    try {
        const productsData = await fs.promises.readFile(productsFilePath, 'utf-8');
        let products = JSON.parse(productsData);

        if (req.query.limit) {
            const limit = parseInt(req.query.limit, 10);
            products = products.slice(0, limit);
        }
        res.send({ status: 'success', payload: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
})

// selecciono un producto por ID

router.get('/:pid', async (req, res) => {
    try {
        const productsData = await fs.promises.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(productsData);
        //console.log(req.params.pid);
        //console.log(products);
        const productId = parseInt(req.params.pid)
        const product = products.find((p) => p.id === productId);
        //console.log(product)
        if (product) {
            res.send({ status: 'success', payload: product });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto' })
    }
})

// agrego un nuevo producto 

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' })
        }

        const productsData = await fs.promises.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(productsData);

        const lastProduct = products[products.length - 1];
        const productId = lastProduct ? lastProduct.id + 1 : 1;

        const productToAdd = {
            id: productId,
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: Array.isArray(thumbnails) ? thumbnails : [thumbnails]
        };

        products.push(productToAdd);
        await fs.promises.writeFile(productsFilePath, JSON.stringify(products, null, 2));

        res.send({ status: "succes", message: "Producto agregado con exito!!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
})

// actualizo producto por id  segun campos en body

router.put('/:pid', async (req, res) => {
    try {

        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title && !description && !code && !price && !stock && !category) {
            return res.status(400).json({ error: 'Necesita ingresar 1 campo como minimo para poder modificar' })
        }

        const productsData = await fs.promises.readFile(productsFilePath, 'utf-8');
        let products = JSON.parse(productsData);
        const productId = parseInt(req.params.pid);
        const productIndex = products.findIndex((p) => p.id === productId);
        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...req.body };
            await fs.promises.writeFile(productsFilePath, JSON.stringify(products, null, 2));
            res.send({ status: "succes", message: "Producto actualizado con exito!!" });
        } else {
            res.status(400).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
})

// elimino un producto por Id

router.delete('/:pid', async (req, res) => {
    try {
        const productsData = await fs.promises.readFile(productsFilePath, 'utf-8');
        let products = JSON.parse(productsData);
        const productId = parseInt(req.params.pid);
        const productIndex = products.findIndex((p) => p.id === productId);
        if (productIndex !== -1) {
            const deleteProduct = products.splice(productIndex, 1)[0];
            await fs.promises.writeFile(productsFilePath, JSON.stringify(products, null, 2));
            res.send({ status: "succes", message: "Producto borrado", detalle: deleteProduct })
        } else {
            res.status(400).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
})


export default router;