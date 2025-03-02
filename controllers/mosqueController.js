const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const Mosque = require('./../models/mosqueModel');
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

// Middleware to upload mosque photo
exports.uploadMosquePhoto = upload.single('image');

// Middleware to resize mosque photo
exports.resizeMosquePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `mosque-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500) // Resize to 500x500 pixels
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) // Set JPEG quality to 90%
    .toFile(`public/img/mosques/${req.file.filename}`);

  // Update the imageUrl field in the mosque document
  req.body.imageUrl = `public/img/mosques/${req.file.filename}`;

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

// Get the current mosque (based on the logged-in admin)
exports.getMyMosque = (req, res, next) => {
  req.params.id = req.user.mosque; // Assuming the mosque ID is stored in the user document
  next();
};

// Update mosque details (for the logged-in admin)
exports.updateMyMosque = catchAsync(async (req, res, next) => {
  // 1) Filter out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'name',
    'address',
    'city',
    'state',
    'country',
    'postalCode',
    'contactEmail',
    'contactPhone',
    'website',
    'capacity',
    'location',
    'imageUrl',
    'qrUrl'
  );

  // 2) Update the mosque document
  const updatedMosque = await Mosque.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: updatedMosque,
  });
});


// Update mosque image (for the logged-in admin)
exports.updateMosqueImage = catchAsync(async (req, res, next) => {

  const filteredBody = filterObj(
    req.body,
    'imageUrl'
  );

  // Update only the imageUrl field
  const updatedMosque = await Mosque.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: { mosque: updatedMosque },
  });
});

// Deactivate a mosque (soft delete)
exports.deactivateMosque = catchAsync(async (req, res, next) => {
  await Mosque.findByIdAndUpdate(req.params.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Create a new mosque (for admin use)
exports.createMosque = factory.createOne(Mosque);

// Get all mosques
exports.getAllMosques = factory.getAll(Mosque);

// Get a single mosque by ID
exports.getMosque = factory.getOne(Mosque);

// Update a mosque (for admin use)
exports.updateMosque = factory.updateOne(Mosque);

// Delete a mosque permanently (for admin use)
exports.deleteMosque = factory.deleteOne(Mosque);