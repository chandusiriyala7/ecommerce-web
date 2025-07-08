const Order = require('../../models/order');

async function placeOrder(req, res) {
  try {
    const { user, address, items, paymentMethod } = req.body;
    if (!user || !address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Missing user, address, or items',
        success: false,
        error: true
      });
    }
    const order = new Order({
      user,
      address,
      items,
      paymentMethod: paymentMethod || 'COD',
    });
    await order.save();
    res.status(201).json({
      message: 'Order placed successfully',
      data: order,
      success: true,
      error: false
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
}

module.exports = placeOrder; 