const Order = require('../../models/order');

async function getUserOrders(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId', error: true, success: false });
    }
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ data: orders, success: true, error: false });
  } catch (err) {
    res.status(500).json({ message: err.message || err, error: true, success: false });
  }
}

module.exports = getUserOrders; 