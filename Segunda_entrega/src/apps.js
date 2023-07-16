import express from "express";
import __dirname from './utils.js';

import messagesRouter from './routes/messages.router.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewRouter from "./routes/views.router.js"
import handlebars from 'express-handlebars'

import { Server } from 'socket.io';


const app = express();
const PORT = 8080;



import mongoose from 'mongoose';


mongoose.set('strictQuery', false)
const connection = mongoose.connect("mongodb+srv://pablosivina:pabloG2411@prueba.hni2pod.mongodb.net/", { dbName: 'ecommerce' })


//mongoose.connect('mongodb+srv://userName:Passwrod@cluster.mongodb.net/', {dbName: 'ecommerce'});




app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + "/public"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', viewRouter)
app.use('/api/products', productsRouter)
app.use('/api/products/:id', productsRouter)
app.use('/api/carts', cartsRouter);
app.use("/api/messages", messagesRouter)

const httpserver = app.listen(PORT, () => console.log("Server arriba"))
const socketServer = new Server(httpserver)

socketServer.on("connection", socket => {
    console.log("Nuevo cliente");
})
export default socketServer