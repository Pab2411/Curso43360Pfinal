import mongoose from "mongoose";

const cartsCollection = 'carts'

const cartsSchema = mongoose.Schema({
    products: Array,
    productsInCart: [{
      _id: { type: mongoose.Types.ObjectId, required: true },
      quantity: { type: Number, default: 1, required: true },
    }],
  });

const cartModel = mongoose.model(cartsCollection, cartsSchema)
export default cartModel;