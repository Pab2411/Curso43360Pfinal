import productsModel from '../models/products.js'

//import { v4 as uuidv4 } from 'uuid'

export default class Products {
    constructor() {
        console.log("Estamos trabajando con bd mongo")
    }

    // Todos los productos con opcion limit
    /*
        getAll = async (limit) => {
            let products = await productsModel.find().limit(limit).lean();
            return products;
        }
    */

<<<<<<< HEAD
        getAll = async (page = 1, limit = 10, sortBy = "price", sortOrder = "asc", search = "") => {
            try {
              const sortOptions = {};
              sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
          
              const options = {
                page: page,
                limit: limit,
                sort: sortOptions,
              };
          
              let query = {};
          
              // Si se proporciona un término de búsqueda, se agrega una expresión regular en la consulta
              if (search) {
                query.description = { $regex: search, $options: "i" }; // La opción "i" hace que la búsqueda sea insensible a mayúsculas y minúsculas
              }
          
              const products = await productsModel.paginate(query, options);
          
              return {
                status: "success",
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}` : null,
                nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}` : null,
              };
            } catch (error) {
              console.error(error);
              return { error: "Error al obtener los productos" };
            }
          };
=======
    getAll = async (page = 1, limit = 10, sortBy = "price", sortOrder = "asc", search = "") => {
        try {
            const sortOptions = {};
            sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
>>>>>>> 202fe4cd33054b09fb06f450400d00febf5219bf

            const options = {
                page: page,
                limit: limit,
                sort: sortOptions,
            };

            let query = {};

            // Si se proporciona un término de búsqueda, se agrega una expresión regular en la consulta
            if (search) {
                query.description = { $regex: search, $options: "i" }; // La opción "i" hace que la búsqueda sea insensible a mayúsculas y minúsculas
            }

            const products = await productsModel.paginate(query, options);

            return {
                status: "success",
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}` : null,
                nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}` : null,
            };
        } catch (error) {
            console.error(error);
            return { error: "Error al obtener los productos" };
        }
    };




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