const userModel = require('../../models/userModel');

async function updateUserAddress(req, res) {
  try {
    console.log('[updateUserAddress] Incoming body:', req.body);
    const { userId, addressIndex, address } = req.body;
    if (!userId || addressIndex === undefined || !address) {
      console.log('[updateUserAddress] Missing fields:', { userId, addressIndex, address });
      return res.status(400).json({ message: 'Missing userId, addressIndex, or address', error: true, success: false });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      console.log('[updateUserAddress] User not found:', userId);
      return res.status(404).json({ message: 'User not found', error: true, success: false });
    }
    if (!user.addresses || !user.addresses[addressIndex]) {
      console.log('[updateUserAddress] Address not found at index:', addressIndex, 'Addresses:', user.addresses);
      return res.status(404).json({ message: 'Address not found', error: true, success: false });
    }
    user.addresses[addressIndex] = address;
    await user.save();
    console.log('[updateUserAddress] Address updated successfully:', user.addresses[addressIndex]);
    res.json({ data: user.addresses, success: true, error: false });
  } catch (err) {
    console.log('[updateUserAddress] Error:', err);
    res.status(500).json({ message: err.message || err, error: true, success: false });
  }
}

module.exports = updateUserAddress; 