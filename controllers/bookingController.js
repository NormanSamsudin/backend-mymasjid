const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

// ✅ Configure Multer for file uploads
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload an image.', 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// ✅ Middleware for uploading proof of booking payment (if required)
exports.uploadBookingImage = upload.single('image');

exports.resizeBookingImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `booking-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/bookings/${req.file.filename}`);

  req.body.imageUrl = `public/img/bookings/${req.file.filename}`;

  next();
});

// ✅ Create a booking
exports.createBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.create(req.body);

  res.status(201).json({
    status: 'success',
    data: booking,
  });
});

// ✅ Get all bookings
exports.getAllBookings = factory.getAll(Booking);

// ✅ Get a single booking
exports.getBooking = factory.getOne(Booking);

// ✅ Update booking (admin only)
exports.updateBooking = catchAsync(async (req, res, next) => {
  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: updatedBooking,
  });
});

// ✅ Approve or Reject booking (admin only)
exports.changeBookingStatus = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: booking,
  });
});

// ✅ Delete a booking
exports.deleteBooking = factory.deleteOne(Booking);
