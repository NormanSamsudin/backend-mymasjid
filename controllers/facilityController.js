const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const Facility = require('./../models/facilityModel');
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

// Middleware to upload facility photo
exports.uploadFacilityPhoto = upload.single('image');

// Middleware to resize facility photo
exports.resizeFacilityPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `facility-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500) // Resize to 500x500 pixels
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) // Set JPEG quality to 90%
    .toFile(`public/img/facilities/${req.file.filename}`);

  // Update the imageUrl field in the facility document
  req.body.imageUrl = `public/img/facilities/${req.file.filename}`;

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

// Update facility image (for the logged-in admin)
exports.updateFacilityImage = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'imageUrl');

  // Update only the imageUrl field
  const updatedFacility = await Facility.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: updatedFacility,
  });
});

// Create a new Facility (for admin use)
exports.createFacility = factory.createOne(Facility);

// Get all Facilities
exports.getAllFacilities = factory.getAll(Facility);

// Get a single Facility by ID
exports.getFacility = factory.getOne(Facility);

// Update a Facility (for admin use)
exports.updateFacility = factory.updateOne(Facility);

// Delete a Facility permanently (for admin use)
exports.deleteFacility = factory.deleteOne(Facility);
