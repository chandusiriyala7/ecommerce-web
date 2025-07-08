const userModel = require('../../models/userModel');

async function getWishlist(req, res) {
  try {
    const userId = req.query.userId || req.userId;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId', error: true, success: false });
    }
    const user = await userModel.findById(userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found', error: true, success: false });
    }
    res.json({ data: user.wishlist, success: true, error: false });
  } catch (err) {
    res.status(500).json({ message: err.message || err, error: true, success: false });
  }
}

module.exports = getWishlist; 