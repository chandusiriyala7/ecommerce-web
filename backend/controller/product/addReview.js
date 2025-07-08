const productModel = require('../../models/productModel');

async function addReview(req, res) {
  try {
    const { productId, userId, rating, comment } = req.body;
    if (!productId || !userId || !rating) {
      return res.status(400).json({ message: 'Missing productId, userId, or rating', error: true, success: false });
    }
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found', error: true, success: false });
    }
    // Check for existing review by this user
    const existing = product.reviews.find(r => r.user.toString() === userId);
    if (existing) {
      // Update existing review
      existing.rating = rating;
      existing.comment = comment;
      existing.date = new Date();
    } else {
      product.reviews.push({ user: userId, rating, comment });
    }
    await product.save();
    res.json({ data: product.reviews, success: true, error: false });
  } catch (err) {
    res.status(500).json({ message: err.message || err, error: true, success: false });
  }
}

module.exports = addReview; 