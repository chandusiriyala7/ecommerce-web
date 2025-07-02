const CustomizedProduct = require('../../models/customizedProduct');

async function saveCustomizedProduct(req, res) {
  try {
    const { userId, productId, image } = req.body;
    if (!userId || !productId || !image) {
      return res.status(400).json({
        message: 'Missing userId, productId, or image',
        success: false,
        error: true
      });
    }
    // Upsert: update if exists, else create
    const saved = await CustomizedProduct.findOneAndUpdate(
      { userId, productId },
      { image },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({
      message: 'Customized product saved',
      data: saved,
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

module.exports = saveCustomizedProduct; 