import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = 'products'

const productsSchema = mongoose.Schema({


    title: String,
    description: String,

    code: {
        type: String,
        required: true,
    },
    price: Number,
    status: {
        type: Boolean,
        default: true,
        required: false,
    },
    stock: Number,
    category: String,

})

productsSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productsCollection, productsSchema)
export default productModel;