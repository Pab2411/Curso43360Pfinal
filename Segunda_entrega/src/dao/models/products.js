import mongoose from "mongoose";
<<<<<<< HEAD
import mongoosePaginate from "mongoose-paginate-v2"
=======
import mongoosePaginate from "mongoose-paginate-v2";
>>>>>>> 202fe4cd33054b09fb06f450400d00febf5219bf

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