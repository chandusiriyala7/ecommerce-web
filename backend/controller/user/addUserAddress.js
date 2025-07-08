const userModel = require('../../models/userModel');

async function addUserAddress(req, res) {
  console.log('POST /user/address called', req.body); // Debug log
  try {
    const { userId, address } = req.body;
    if (!userId || !address) {
      return res.status(400).json({ message: 'Missing userId or address', error: true, success: false });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', error: true, success: false });
    }
    user.addresses.push(address);
    await user.save();
    res.json({ data: user.addresses, success: true, error: false });
  } catch (err) {
    res.status(500).json({ message: err.message || err, error: true, success: false });
  }
}

module.exports = addUserAddress; 