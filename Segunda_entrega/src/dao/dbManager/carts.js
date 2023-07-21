import cartModel from '../models/carts.js'
import { ObjectId } from 'mongoose';


export default class Carts {
  constructor() {
    console.log("Estamos trabajando con bd mongo");
  }

  // Creo un carrito
  
  createCart = async () => {
    try {
      const newCart = new cartModel();
      const result = await newCart.save();
      return { status: "success", message: "Carrito generado con éxito" };
    } catch (error) {
      console.error(error);
      return { error: "Error al crear el carrito" };
    }
  };

  // obtengo productos de un carrito por Id


  getCartById = async (cartId) => {
    try {
      const cart = await cartModel.findById(cartId).populate('products.product');
      return cart;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el carrito por su ID');
    }
  };
  /*
  getCartById = async (cartId) => {
    try {
      const cart = await cartModel.findOne({ _id: cartId }).lean();

      if (!cart) {
        return { error: 'Carrito no encontrado' };
      }

      return { status: 'success', payload: cart.products };
    } catch (error) {
      console.error(error);
      return { error: 'Error al obtener los productos del carrito' };
    }
  };
*/

  // agrego un producto al carrito

  addProductToCart = async (cartId, productId) => {
    try {
      if (!cartId || !productId) {
        return { error: 'Los parámetros cartId y productId son obligatorios' };
      }

      const cart = await cartModel.findById(cartId);

      if (!cart) {
        return { error: 'Carrito no encontrado' };
      }

      const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);

      if (productIndex !== -1) {
        //console.log('Antes de incrementar: ', cart.products[productIndex].quantity);

        cart.products[productIndex].quantity = parseInt(cart.products[productIndex].quantity) + 1;

        // console.log('Después de incrementar: ', cart.products[productIndex].quantity);

      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      // await cart.save();

      await cartModel.updateOne({ _id: cart._id }, cart);

      return { status: 'success', message: 'Producto agregado' };
    } catch (error) {
      console.error(error);
      return { error: 'Error al agregar el producto al carrito' };
    }
  };

  // Elimino un producto del carrito

  removeProductFromCart = async (cartId, productId) => {
    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) {
        return { error: 'Carrito no encontrado' };
      }

      cart.products = cart.products.filter(product => product.product.toString() !== productId);

      await cart.save();

      return { status: 'success', message: 'Producto eliminado del carrito' };
    } catch (error) {
      console.error(error);
      return { error: 'Error al eliminar el producto del carrito' };
    }
  };

  // Actualizo el carrito completo con un arreglo de productos

  updateCartProducts = async (cid, products) => {
    if (!cid || !products || !Array.isArray(products)) {
      return { status: "error", error: "Faltan datos o el formato es incorrecto" };
    }
  
    try {
      const cart = await cartModel.findOne({ _id: cid });
  
      if (!cart) {
        return { status: "error", error: "Carrito inexistente" };
      }
  
      for (const newProduct of products) {
        const existingProduct = cart.productsInCart.find((product) =>
          product._id.equals(newProduct._id)
        );
  
        if (existingProduct) {
          // Si el producto ya existe, aumentar la cantidad
          existingProduct.quantity += newProduct.quantity;
        } else {
          // Si el producto no existe, agregarlo al carrito
          cart.productsInCart.push({ _id: ObjectId(newProduct._id), quantity: newProduct.quantity });
        }
      }
  
      await cart.save();
      return { status: "success", payload: cart };
    } catch (error) {
      console.error('Error al actualizar el carrito:', error);
      return { status: "error", error: "Error al actualizar el carrito" };
    }
  };
}