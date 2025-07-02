const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productName : String,
    brandName : String,
    category : String,
    productImage : [],
    description : String,
    price : Number,
    sellingPrice : Number,
    backgrounds: [String],
    presets: [String]
},{
    timestamps : true
})


const productModel = mongoose.model("product",productSchema)

module.exports = productModel