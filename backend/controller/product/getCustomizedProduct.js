const CustomizedProduct = require('../../models/customizedProduct');

async function getCustomizedProduct(req, res) {
  try {
    const { userId, productId } = req.query;
    if (!userId || !productId) {
      return res.status(400).json({
        message: 'Missing userId or productId',
        success: false,
        error: true
      });
    }
    const customized = await CustomizedProduct.findOne({ userId, productId });
    res.status(200).json({
      data: customized ? customized.image : null,
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

module.exports = getCustomizedProduct; 