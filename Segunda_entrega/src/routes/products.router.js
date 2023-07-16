import { Router } from "express";
import Product from '../dao/dbManager/products.js';
import fs from "fs"


const router = Router();
const productsManager = new Product();


// Obtener todos los productos

router.get('/', async (req, res) => {
    let products = await productsManager.getAll();
    res.send({ status: "success", payload: products })
})

// Obtener un producto por ID

router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    const result = await productsManager.getProductById(productId);
    res.json(result);
});

// agrego un nuevo producto 

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' })
        }

        const productToAdd = {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: Array.isArray(thumbnails) ? thumbnails : [thumbnails]
        };

        const result = await productsManager.addProduct(productToAdd)

        res.send({ status: "succes", message: "Producto agregado con exito!!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
})





// Modifico por Id

router.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedData = req.body;
    const result = await productsManager.updateProduct(productId, updatedData);
    res.json(result);
});

// Borro con Id

router.delete('/:id', async (req, res) => {
    const productId = req.params.id;
    const result = await productsManager.deleteProduct(productId);
    res.json(result);
});

export default router;