import { Router } from "express";
import Product from '../dao/dbManager/products.js';

import fs from "fs"


const router = Router();
const productsManager = new Product();



// Obtener todos los productos con opcion limit
/*
router.get('/', async (req, res) => {
    let limit = req.query.limit || 10; // Si no se proporciona un límite, se establece en 10.
    limit = parseInt(limit); // Convierte el valor del límite a un número entero.

    // Verifica si el límite no es un número válido o es menor que cero.
    if (isNaN(limit) || limit < 1) {
        limit = 10; // Establece un valor predeterminado de 10 si el límite no es válido.
    }

    let products = await productsManager.getAll(limit);
    res.send({ status: "success", payload: products });
});
*/
router.get("/", async (req, res) => {
    try {
      let page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      const sortBy = req.query.sortBy || "price";
      const sortOrder = req.query.sortOrder || "asc";
  
      if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
        page = 1;
        limit = 10;
      }
  
      const result = await productsManager.getAll(page, limit, sortBy, sortOrder);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  });








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