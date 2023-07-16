import productsModel from '../models/products.js'

//import { v4 as uuidv4 } from 'uuid'

export default class Products {
    constructor() {
        console.log("Estamos trabajando con bd mongo")
    }

    // Todos los productos

    getAll = async () => {
        let products = await productsModel.find().lean();
        return products
    }

    // selecciono un producto por ID

    getProductById = async (productId) => {
        try {
            const product = await productsModel.findOne({ id: productId }).lean();
            if (product) {
                return { status: 'success', payload: product };
            } else {
                return { error: 'Producto no encontrado' };
            }
        } catch (error) {
            console.error(error);
            return { error: 'Error al obtener el producto' };
        }
    };

    // Agrego un producto

    addProduct = async (productData) => {
        try {
            const { title, description, code, price, stock, category, thumbnails } = productData;
            if (!title || !description || !code || !price || !stock || !category) {
                return { error: 'Todos los campos son obligatorios' };
            }

            const newProduct = new productsModel({
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails: Array.isArray(thumbnails) ? thumbnails : [thumbnails]
            });

            const result = await productsModel.create(productData);
            return result;
        } catch (error) {
            console.error(error);
            return { error: 'Error al agregar el producto' };
        }
    };



    // actualizo producto por id segun campos en body

    updateProduct = async (productId, updatedData) => {
        try {
            const { title, description, code, price, stock, category, thumbnails } = updatedData;
            if (!title && !description && !code && !price && !stock && !category) {
                return { error: 'Necesita ingresar al menos un campo para poder modificar' };
            }

            const product = await productsModel.findOne({ _id: productId });
            if (product) {
                product.title = title || product.title;
                product.description = description || product.description;
                product.code = code || product.code;
                product.price = price || product.price;
                product.stock = stock || product.stock;
                product.category = category || product.category;
                product.thumbnails = thumbnails || product.thumbnails;

                await product.save();

                return { status: "success", message: "Producto actualizado con éxito" };
            } else {
                return { error: 'Producto no encontrado' };
            }
        } catch (error) {
            console.error(error);
            return { error: 'Error al actualizar el producto' };
        }
    };

    // Borro un producto por ID

    deleteProduct = async (_id) => {
        try {
            const product = await productsModel.findOne({ _id });

            if (product) {
                const deletedProduct = await productsModel.deleteOne({ _id });

                return { status: "success", message: "Producto borrado", detalle: deletedProduct };
            } else {
                return { error: 'Producto no encontrado' };
            }
        } catch (error) {
            console.error(error);
            return { error: 'Error al eliminar el producto' };
        }
    };
}