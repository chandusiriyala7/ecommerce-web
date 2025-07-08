const productModel = require('../../models/productModel');

async function getReviews(req, res) {
  try {
    const { productId } = req.query;
    if (!productId) {
      return res.status(400).json({ message: 'Missing productId', error: true, success: false });
    }
    const product = await productModel.findById(productId).populate('reviews.user', 'name profilePic');
    if (!product) {
      return res.status(404).json({ message: 'Product not found', error: true, success: false });
    }
    res.json({ data: product.reviews, success: true, error: false });
  } catch (err) {
    res.status(500).json({ message: err.message || err, error: true, success: false });
  }
}

module.exports = getReviews; 