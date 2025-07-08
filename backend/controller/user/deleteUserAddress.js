const userModel = require('../../models/userModel');

async function deleteUserAddress(req, res) {
  try {
    const { userId, addressIndex } = req.body;
    if (!userId || addressIndex === undefined) {
      return res.status(400).json({ message: 'Missing userId or addressIndex', error: true, success: false });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', error: true, success: false });
    }
    if (!user.addresses || !user.addresses[addressIndex]) {
      return res.status(404).json({ message: 'Address not found', error: true, success: false });
    }
    user.addresses.splice(addressIndex, 1);
    await user.save();
    res.json({ data: user.addresses, success: true, error: false });
  } catch (err) {
    res.status(500).json({ message: err.message || err, error: true, success: false });
  }
}

module.exports = deleteUserAddress; 