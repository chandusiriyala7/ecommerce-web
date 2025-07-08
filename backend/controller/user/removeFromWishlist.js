const userModel = require('../../models/userModel');

async function removeFromWishlist(req, res) {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: 'Missing userId or productId', error: true, success: false });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', error: true, success: false });
    }
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    res.json({ data: user.wishlist, success: true, error: false });
  } catch (err) {
    res.status(500).json({ message: err.message || err, error: true, success: false });
  }
}

module.exports = removeFromWishlist; 