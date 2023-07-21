import { Router } from "express"
import productModel from "../dao/models/products.js";
import Carts from "../dao/dbManager/carts.js"

import messagesManager from "../dao/dbManager/messages.js"
import cartModel from "../dao/models/carts.js";

const router = Router()
const manejadorMensajes = new messagesManager()


// Ruta para la vista de productos

router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const response = await productsModel.paginate({}, { limit, page });

        const { status, docs, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink } = response;

        const products = docs.map(product => ({
            ...product.toObject(),
            _id: product._id.toString()
        }));

        res.render("products", {
            layout: false,
            status,
            products,
            totalPages,
            page,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
            prevLink,
            nextLink,
        });
    } catch (error) {
        console.error(error);
        res.render("error", { message: "Error al obtener los productos" });
    }
});

// Ruta para visualizar un carrito específico

router.get("/carts/:cartId", async (req, res) => {
    try {
      const cartId = req.params.cartId;
      const cart = await cartModel
        .findOne({ _id: cartId })
        .populate({
          path: 'products.product',
          model: productModel,
        })
        .select('-__v');
  
      if (!cart) {
        // Si no se encuentra el carrito, renderiza una vista de error o mensaje de que el carrito no existe.
        res.render("error", { message: "El carrito no fue encontrado" });
        return;
      }
  
      const products = cart.products.map(productData => ({
        ...productData.product.toObject(),
        quantity: productData.quantity
      }));
  
      res.render("carts", { cart, products });
    } catch (error) {
      console.error(error);
      res.render("error", { message: "Error al obtener el carrito" });
    }
  });

/*
router.get("/carts/:cartId", async (req, res) => {
    try {
      const cartId = req.params.cartId;
      const cart = await Carts.getCartById(cartId);
  
      if (!cart) {
        // Si no se encuentra el carrito, renderiza una vista de error o mensaje de que el carrito no existe.
        res.render("error", { message: "El carrito no fue encontrado" });
        return;
      }
  
      const products = cart.products; // Obtener los productos del carrito
  
      res.render("cart", { cart, products }); // Renderizar la vista 'cart' con los datos del carrito y sus productos.
    } catch (error) {
      console.error(error);
      res.render("error", { message: "Error al obtener el carrito" });
    }
  });
*/
// Ruta para la vista de mensajes

router.get("/", async (req, res) => {
    let messages = await manejadorMensajes.getAllMessages()
    res.render("chat", { messages })
})

export default router