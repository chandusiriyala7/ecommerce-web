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
    presets: [String],
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        date: { type: Date, default: Date.now }
      }
    ]
},{
    timestamps : true
})


const productModel = mongoose.model("product",productSchema)

module.exports = productModel