import express, { json } from 'express';
import fs from 'fs';
import { Router } from 'express';

const router = Router();
const productsFilePath = './archivoHL/carrito.json'




class Carrito {
    constructor() {
        this.id = null;
        this.products = []
    }
}

// generador de Id

async function generadordeCarritoId() {
    try {
        const cartsData = await fs.promises.readFile(productsFilePath, 'utf-8');
        const carts = JSON.parse(cartsData);

        if (!Array.isArray(carts)) {
            throw new Error('El formato del archivo es incorrecto');
        }

        const lastCart = carts[carts.length - 1];
        const cartId = lastCart ? lastCart.id + 1 : 1;
        return cartId
    } catch (error) {
        console.error(error);
        throw new error('error al generar el id');
    }
}

// creo un carrito nuevo

router.post('/', async (req, res) => {
    try {
        const newCart = new Carrito();
        newCart.id = await generadordeCarritoId();

        const cartsData = await fs.promises.readFile(productsFilePath, 'utf-8');
        const carts = JSON.parse(cartsData);
        carts.push(newCart);

        await fs.promises.writeFile(productsFilePath, JSON.stringify(carts, null, 2));
        res.send({ status: "succes", message: "Carrito generado con exito!!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// obtengo productos de un carrito por Id

router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);

        const cartsData = await fs.promises.readFile(productsFilePath, 'utf-8');
        const carts = JSON.parse(cartsData);
        const cart = carts.find((cart) => cart.id === cartId);

        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }
        res.send({ status: "succes", playload: cart.products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos del carrito' });
    }
})

// agrego un producto al carrito

router.post('/:cid/products/:pid', async (req, res) => {



    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        if (!cartId || !productId || isNaN(cartId) || isNaN(productId) || cartId <= 0 || productId <= 0) {
            return res.status(400).json({ error: 'Los parámetros deben ser números positivos' });
        }

        const data = await fs.promises.readFile(productsFilePath, 'utf-8');

        const cart = JSON.parse(data);

        const cartIdOk = cart.find((c) => c.id === cartId)

        if (cartIdOk) {
            if (cartIdOk.products && Array.isArray(cartIdOk.products)) {

                const product = cartIdOk.products.find((p) => p.product === productId);

                if (product) {
                    product.quantity++;
                } else {
                    cartIdOk.products.push({
                        product: productId,
                        quantity: 1,
                    });
                }
                await fs.promises.writeFile(productsFilePath, JSON.stringify(cart, null, 2));
                return res.send({ status: 'success', message: 'Producto agregado', playload: cartIdOk.products });

            } else {
                return res.status(500).json({ error: 'Los productos del carrito no estan definidos' })
            }
        } else {
            return res.status(404).json({ error: 'Carrito no encontrado' })
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
})





export default router;