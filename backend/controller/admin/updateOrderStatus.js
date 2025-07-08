const Order = require('../../models/order');

async function updateOrderStatus(req, res) {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ message: 'Missing orderId or status', error: true, success: false });
    }
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found', error: true, success: false });
    }
    res.json({ data: order, success: true, error: false });
  } catch (err) {
    res.status(500).json({ message: err.message || err, error: true, success: false });
  }
}

module.exports = updateOrderStatus; 