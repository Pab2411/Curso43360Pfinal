import mongoose from "mongoose";

const cartsCollection = 'carts'

const cartsSchema = mongoose.Schema({
    products : Array,
    })

    const cartModel = mongoose.model(cartsCollection,cartsSchema)
    export default cartModel;