import { Router } from "express";
import Product from '../dao/dbManager/products.js';
import productsModel from "../dao/models/products.js";
import fs from "fs"


const router = Router();
const productsManager = new Product();



router.get("/", async (req, res) => {
    const { limit = 10 } = req.query
    const { page = 1 } = req.query

    let filtro = {};

    if (req.query.status == "true") {
        filtro = { status: true }
    } else if (req.query.status == "false") {
        filtro = { status: false }
    } else if (req.query.category) {
        filtro = { category: req.query.category }
    }

    const { totalPages, docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productsModel.paginate(filtro, { limit, page, lean: true })

    let products = docs

    if (req.query.sort == "asc") {
        products = await productsModel.find().sort({ price: 1 })
    } else if (req.query.sort == "desc") {
        products = await productsModel.find().sort({ price: -1 })
    }

    let prevLink
    hasPrevPage ? prevLink = prevLink = `http://localhost:8080/products?page=${prevPage}` : null

    let nextLink
    hasNextPage ? nextLink = nextLink = `http://localhost:8080/products?page=${nextPage}` : null

    res.send({ status: "success", payload: products, totalPages, page, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink })
})







// Obtener un producto por ID

router.get('/:id', async (req, res) => {
    const productId = req.query.id;
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