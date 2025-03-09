const Sadaqah = require('../models/sadaqahModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// ✅ Create a new sadaqah donation
exports.createSadaqah = catchAsync(async (req, res, next) => {
  const sadaqah = await Sadaqah.create(req.body);

  res.status(201).json({
    status: 'success',
    data: sadaqah,
  });
});

// ✅ Get all sadaqah donations
exports.getAllSadaqah = factory.getAll(Sadaqah);

// ✅ Get a single sadaqah by ID
exports.getSadaqah = factory.getOne(Sadaqah);

// ✅ Update a sadaqah (e.g., mark as completed)
exports.updateSadaqah = factory.updateOne(Sadaqah);

// ✅ Delete a sadaqah
exports.deleteSadaqah = factory.deleteOne(Sadaqah);
