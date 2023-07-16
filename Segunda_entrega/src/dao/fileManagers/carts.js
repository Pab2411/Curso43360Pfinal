import fs from 'fs';



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

createCart = async () => {
  try {
    const newCart = new Carrito();
    newCart.id = await generadordeCarritoId();

    const cartsData = await fs.promises.readFile(productsFilePath, 'utf-8');
    const carts = JSON.parse(cartsData);
    carts.push(newCart);

    await fs.promises.writeFile(productsFilePath, JSON.stringify(carts, null, 2));

    return { status: "success", message: "Carrito generado con éxito" };
  } catch (error) {
    console.error(error);
    return { error: "Error al crear el carrito" };
  }
};

// obtengo productos de un carrito por Id

getCartById = async (cartId) => {
  try {
    const cartsData = await fs.promises.readFile(productsFilePath, 'utf-8');
    const carts = JSON.parse(cartsData);
    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
      return { error: 'Carrito no encontrado' };
    }

    return { status: 'success', payload: cart.products };
  } catch (error) {
    console.error(error);
    return { error: 'Error al obtener los productos del carrito' };
  }
};

// agrego un producto al carrito

addProductToCart = async (cartId, productId) => {
  try {
    if (!cartId || !productId || isNaN(cartId) || isNaN(productId) || cartId <= 0 || productId <= 0) {
      return { error: 'Los parámetros deben ser números positivos' };
    }

    const data = await fs.promises.readFile(productsFilePath, 'utf-8');
    const cart = JSON.parse(data);

    const cartIdOk = cart.find((c) => c.id === cartId);

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
        return { status: 'success', message: 'Producto agregado' };
      } else {
        return { error: 'Los productos del carrito no están definidos' };
      }
    } else {
      return { error: 'Carrito no encontrado' };
    }
  } catch (error) {
    console.error(error);
    return { error: 'Error al agregar el producto al carrito' };
  }
};

// Elimino un producto del carrito

removeProductFromCart = async (cartId, productId) => {
  try {
    const data = await fs.promises.readFile(productsFilePath, 'utf-8');
    const carts = JSON.parse(data);

    const cart = carts.find((c) => c.id === cartId);
    if (!cart) {
      return { error: 'Carrito no encontrado' };
    }

    const productIndex = cart.products.findIndex((p) => p.product === productId);
    if (productIndex === -1) {
      return { error: 'Producto no encontrado en el carrito' };
    }

    cart.products.splice(productIndex, 1);

    await fs.promises.writeFile(productsFilePath, JSON.stringify(carts, null, 2));

    return { status: 'success', message: 'Producto eliminado del carrito' };
  } catch (error) {
    console.error(error);
    return { error: 'Error al eliminar el producto del carrito' };
  }
};

// Actualizo el carrito completo con un arreglo de productos

updateCart = async (cartId, products) => {
  try {
    if (!cartId || !products) {
      return { error: 'Los parámetros cartId y products son obligatorios' };
    }

    const cartsData = await fs.promises.readFile(productsFilePath, 'utf-8');
    const carts = JSON.parse(cartsData);

    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
      return { error: 'Carrito no encontrado' };
    }

    for (const newProduct of products) {
      const existingProduct = cart.products.find((p) => p.product.toString() === newProduct.product.toString());

      if (existingProduct) {
        console.log('Antes de incrementar:', existingProduct.quantity);

        existingProduct.quantity += newProduct.quantity;

        console.log('Después de incrementar:', existingProduct.quantity);
      } else {
        cart.products.push(newProduct);
      }
    }

    await fs.promises.writeFile(productsFilePath, JSON.stringify(carts, null, 2));

    return { status: 'success', message: 'Carrito actualizado con éxito' };
  } catch (error) {
    console.error(error);
    return { error: 'Error al actualizar el carrito' };
  }
};

// Actualizo cantidad del producto, segun datos proporcionados

updateProductQuantity = async (cartId, productId, quantity) => {
  try {
    if (!cartId || !productId || !quantity) {
      return { error: 'Los parámetros cartId, productId y quantity son obligatorios' };
    }

    const cartsData = await fs.promises.readFile(productsFilePath, 'utf-8');
    const carts = JSON.parse(cartsData);

    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
      return { error: 'Carrito no encontrado' };
    }

    const product = cart.products.find((p) => p.product === productId);

    if (!product) {
      return { error: 'Producto no encontrado en el carrito' };
    }

    console.log('Cantidad anterior:', product.quantity);

    product.quantity += parseInt(quantity);

    console.log('Cantidad actualizada:', product.quantity);

    await fs.promises.writeFile(productsFilePath, JSON.stringify(carts, null, 2));

    return { status: 'success', message: 'Cantidad de producto actualizada' };
  } catch (error) {
    console.error(error);
    return { error: 'Error al actualizar la cantidad del producto en el carrito' };
  }
};

