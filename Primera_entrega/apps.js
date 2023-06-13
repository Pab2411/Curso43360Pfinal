import express from 'express'
import productsRouter from './route/products.router.js'
import cartsRouter from './route/carts.router.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const server = app.listen(8080, () => console.log("Seervidor arriba"))