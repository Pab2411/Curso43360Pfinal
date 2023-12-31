import { Router } from "express";
import Cart from '../dao/dbManager/carts.js';
import cartModel from "../dao/models/carts.js";
import productModel from '../dao/models/products.js'

const router = Router();
const cartManager = new Cart();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const result = await cartManager.createCart();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});


// Obtener productos de un carrito por su ID


router.get('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await cartModel
      .findById(cartId)
      .populate({
        path: 'products.product',
        model: productModel,
      })
      .select('-__v');
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el carrito por su ID' });
  }
});


// agrego un producto al carrito

router.post('/:cartId/products/:productId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;

    const result = await cartManager.addProductToCart(cartId, productId);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

// Eliminar un producto del carrito

router.delete('/:cartId/products/:productId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const result = await cartManager.removeProductFromCart(cartId, productId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
});

// Actualizo el carrito completo con un arreglo de productos

router.put('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const products = req.body.products;


    const result = await cartManager.updateCart(cartId, products);

    if (result.status === 'error') {
      return res.status(400).json({ error: result.error });
    }

    res.json({ status: 'success', payload: result.payload });
  } catch (error) {
    console.error('Error al actualizar el carrito:', error);
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
});




/*
router.put('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const products = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'El valor de products debe ser un arreglo' });
    }

    const result = await cartManager.updateCart(cartId, products);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
});
*/


// Actualizo cantidad del producto, segun Id producto proporcionado

router.put('/:cartId/products/:productId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const quantity = req.body.quantity;

    if (!cartId || !productId || !quantity) {
      return res.status(400).json({ error: 'Los parámetros cartId, productId y quantity son obligatorios' });
    }

    const result = await cartManager.updateProductQuantity(cartId, productId, quantity);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
  }
});

// Eliminar todos los productos del carrito

router.delete('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;

    const result = await cartManager.clearCart(cartId);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar los productos del carrito' });
  }
});


export default router;