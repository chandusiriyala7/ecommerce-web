const userModel = require('../../models/userModel');

const updateUser = async (req, res) => {
    try {
        const { userId, name, email, profilePic, addresses } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'Missing userId', error: true, success: false });
        }
        const updateFields = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (profilePic) updateFields.profilePic = profilePic;
        if (addresses) updateFields.addresses = addresses;
        const user = await userModel.findByIdAndUpdate(userId, updateFields, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found', error: true, success: false });
        }
        res.json({ data: user, success: true, error: false });
    } catch (err) {
        res.status(500).json({ message: err.message || err, error: true, success: false });
    }
};

module.exports = updateUser;