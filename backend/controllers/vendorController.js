const { Vendor } = require('../models');

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Private
exports.getVendors = async (req, res) => {
  try {
    const { category, search } = req.query;
    let whereClause = { isActive: true };

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause.name = { [require('sequelize').Op.iLike]: `%${search}%` };
    }

    const vendors = await Vendor.findAll({
      where: whereClause,
      order: [['rating', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single vendor
// @route   GET /api/vendors/:id
// @access  Private
exports.getVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create vendor (Admin only)
// @route   POST /api/vendors
// @access  Private/Admin
exports.createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);

    res.status(201).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update vendor (Admin only)
// @route   PUT /api/vendors/:id
// @access  Private/Admin
exports.updateVendor = async (req, res) => {
  try {
    let vendor = await Vendor.findByPk(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    vendor = await vendor.update(req.body);

    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete vendor (Admin only)
// @route   DELETE /api/vendors/:id
// @access  Private/Admin
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    await vendor.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
