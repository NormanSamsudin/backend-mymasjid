const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const Committee = require('./../models/committeeModel');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// Image will be stored as a buffer
const multerStorage = multer.memoryStorage();

// Filter to allow only image files
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload an image.', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// Middleware to upload committee photo
exports.uploadCommitteePhoto = upload.single('image');

// Middleware to resize committee photo
exports.resizeCommitteePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `committee-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500) // Resize to 500x500 pixels
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) // Set JPEG quality to 90%
    .toFile(`public/img/committees/${req.file.filename}`);

  // Update the imageUrl field in the committee document
  req.body.imageUrl = `public/img/committees/${req.file.filename}`;

  next();
});

// Filter out unwanted fields from the request body
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Update committee image (for the logged-in admin)
exports.updateCommitteeImage = catchAsync(async (req, res, next) => {

  const filteredBody = filterObj(
    req.body,
    'imageUrl'
  );

  // Update only the imageUrl field
  const updatedCommittee = await Committee.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: updatedCommittee,
  });
});

// Create a new Committee (for admin use)
exports.createCommittee = factory.createOne(Committee);

// Get all Committees
exports.getAllCommittee = factory.getAll(Committee);

// Get a single Committee by ID
exports.getCommittee = factory.getOne(Committee);

// Update a Committee (for admin use)
exports.updateCommittee = factory.updateOne(Committee);

// Delete a Committee permanently (for admin use)
exports.deleteCommittee = factory.deleteOne(Committee);