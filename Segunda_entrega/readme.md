# Desarrollo del Servidor - Node.js y Express

El objetivo de este proyecto es desarrollar un servidor basado en Node.js y Express que escuche en el puerto 8080 y proporcione dos grupos de rutas: `/products` , `/carts` y `/messages`. Cada uno de estos grupos de rutas estará implementado con el enrutador de Express, siguiendo las siguientes especificaciones:

## Rutas de Products

El enrutador de Products estará configurado en `/api/products/` y contará con las siguientes rutas:

- **GET /:** Esta ruta deberá listar todos los productos almacenados en la base de datos. También se debe contar con una limitación opcional `?limit` .

- **GET /:pid:** Esta ruta deberá traer únicamente el producto con el ID proporcionado.

- **POST /:** Esta ruta deberá agregar un nuevo producto a la base de datos. Los campos requeridos se ingresan por body y son los siguientes

  - `title`: 
  - `description`: 
  - `code`: 
  - `price`: 
  - `status`: `true`.
  - `stock`:
  - `category`: 
  - `thumbnails`: 

- **PUT /:pid:** Esta ruta actualizará los campos de un producto existente con los valores proporcionados en body. 

- **DELETE /:pid:** Esta ruta eliminará el producto con el ID proporcionado.

## Rutas de Carts

El enrutador de Carts estará configurado en `/api/carts/` y contará con las siguientes rutas:

- **POST /:** Esta ruta creará un nuevo carrito con la siguiente estructura:

  - `id`:
  - `products`: []

- **GET /:cid:** Esta ruta listará los productos que pertenecen al carrito con el ID `cid` proporcionado.

- **POST /:cid/product/:pid:** Esta ruta agregará el producto especificado al arreglo `products` del carrito seleccionado. El producto se agregará como un objeto con la siguiente estructura:

  - `product`: Solo Id
  - `quantity`: Número que representa la cantidad de ejemplares de dicho producto. 

  Si un producto ya existe se incrementa el campo `quantity`.

  El enrutador de Chats estará configurado en `/api/messages/` y contará con las siguientes ruta:

  **POST /:messages** Esta ruta creará un mensaje con la siguiente estructura:

  - `user`:
  - `message`: 

La persistencia de la información se implementará utilizando el sistema base de datos `MongoDB`

## Rutas de trabajo en Postman

- **GET http://localhost:8080/api/products**  todos los productos
- **GET http://localhost:8080/api/products?limit=1** todos los productos con limite.
- **GET http://localhost:8080/api/products/1** busco producto por ID
- **POST http://localhost:8080/api/products** agrego un producto
- **PUT http://localhost:8080/api/products/1** mmodifico datos 
- **DELETE http://localhost:8080/api/products/1** borro un producto completo según ID

- **POST http://localhost:8080/api/carts** creo un carrito
- **GET http://localhost:8080/api/carts/1** busco un carrito
- **POST http://localhost:8080/api/carts/1/products/2** agrego un producto al carrito

-**POST http://localhost:8080/api/messages** agrega un chat  


