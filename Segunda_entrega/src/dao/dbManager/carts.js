import cartModel from '../models/carts.js'



export default class Carts {
  constructor() {
    console.log("Estamos trabajando con bd mongo");
  }

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

      if (!cart.products || !Array.isArray(cart.products)) {
        return { error: 'El carrito no contiene la lista de productos o no está correctamente formateada' };
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

  updateCart = async (cid, products) => {
    if (!cid || !products) return ({ status: "error", error: "Faltan datos" });

    try {
      const cart = await cartModel.findByIdAndUpdate(
        cid,
        { products: products },
        { new: true }
      );

      if (!cart) return ({ status: "error", error: "Carrito inexistente" });

      return ({ status: "success", payload: cart });
    } catch (error) {
      console.error(error);
      return ({ status: "error", error: "Error al actualizar el carrito" });
    }
  };


  // Actualizo cantidad del producto, 

  updateProductQuantity = async (cartId, productId, quantity) => {
    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) {
        return { error: 'Carrito no encontrado' };
      }

      const product = cart.products.find((p) => p.product.toString() === productId);

      if (!product) {
        return { error: 'Producto no encontrado en el carrito' };
      }
      console.log('Cantidad anterior:', product.quantity);

      product.quantity += parseInt(quantity);

      console.log('Cantidad actualizada:', product.quantity);

      await cartModel.updateOne(
        { _id: cartId, 'products.product': productId },
        { $set: { 'products.$.quantity': product.quantity } }
      );

      return { status: 'success', message: 'Cantidad de producto actualizada' };
    } catch (error) {
      console.error(error);
      return { error: 'Error al actualizar la cantidad del producto en el carrito' };
    }
  };

  // Eliminar todos los productos del carrito

  clearCart = async (cartId) => {
    try {
      if (!cartId) {
        return { error: 'El parámetro cartId es obligatorio' };
      }

      const cart = await cartModel.findById(cartId);

      if (!cart) {
        return { error: 'Carrito no encontrado' };
      }

      cart.products = [];

      await cart.save();

      return { status: 'success', message: 'Productos eliminados del carrito' };
    } catch (error) {
      console.error(error);
      return { error: 'Error al eliminar los productos del carrito' };
    }
  };




}