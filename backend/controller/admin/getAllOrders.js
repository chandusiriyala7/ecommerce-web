const Order = require('../../models/order');

async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate('user', 'name email profilePic')
      .populate('items.productId', 'name image price')
      .sort({ createdAt: -1 });
    res.json({ data: orders, success: true, error: false });
  } catch (err) {
    res.status(500).json({ message: err.message || err, error: true, success: false });
  }
}

module.exports = getAllOrders; 