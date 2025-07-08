const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
      quantity: { type: Number, required: true },
      customizedImage: { type: String },
    }
  ],
  status: { type: String, default: 'Pending' }, // Pending, Confirmed, Shipped, Delivered, Cancelled
  paymentMethod: { type: String, default: 'COD' },
}, {
  timestamps: true
});

const Order = mongoose.model('order', orderSchema);

module.exports = Order; 