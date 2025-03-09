const multer = require('multer');
const sharp = require('sharp');
const Event = require('../models/eventModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// ✅ Configure Multer (store images in memory as buffers)
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload an image.', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// ✅ Middleware to handle image upload
exports.uploadEventImage = upload.single('image');

// ✅ Middleware to process and save image
exports.resizeEventImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // Generate a unique filename
  req.file.filename = `event-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(800, 600) // Resize image to 800x600
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) // Optimize image
    .toFile(`public/img/events/${req.file.filename}`);

  // Save the image URL in the request body
  req.body.imageUrl = `public/img/events/${req.file.filename}`;

  next();
});

// ✅ Update event image
exports.updateEventImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { imageUrl: req.body.imageUrl },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: event,
  });
});

// ✅ Create a new mosque event
exports.createEvent = catchAsync(async (req, res, next) => {
  const event = await Event.create(req.body);

  res.status(201).json({
    status: 'success',
    data: event,
  });
});

// ✅ Get all mosque events
exports.getAllEvents = factory.getAll(Event);

// ✅ Get a single mosque event by ID
exports.getEvent = factory.getOne(Event);

// ✅ Update an event
exports.updateEvent = factory.updateOne(Event);

// ✅ Delete an event
exports.deleteEvent = factory.deleteOne(Event);

// ✅ Register a user for an event
exports.registerForEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('No event found with that ID', 404));
  }

  if (!event.attendees.includes(req.user.id)) {
    event.attendees.push(req.user.id);
    await event.save();
  }

  res.status(200).json({
    status: 'success',
    data: event,
  });
});

// ✅ Unregister a user from an event
exports.unregisterFromEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('No event found with that ID', 404));
  }

  event.attendees = event.attendees.filter(
    (attendee) => attendee.toString() !== req.user.id
  );
  await event.save();

  res.status(200).json({
    status: 'success',
    data: event,
  });
});

 
