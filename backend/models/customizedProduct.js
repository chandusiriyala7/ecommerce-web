const mongoose = require('mongoose');

const customizedProductSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  image: { type: String, required: true }, // base64 or URL
}, {
  timestamps: true
});

const CustomizedProduct = mongoose.model('customizedProduct', customizedProductSchema);

module.exports = CustomizedProduct; 