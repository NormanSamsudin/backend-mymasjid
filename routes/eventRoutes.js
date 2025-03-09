const express = require('express');
const eventController = require('../controllers/eventController');
const authController = require('../controllers/authController');

const router = express.Router();

// ✅ Public Routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);

// ✅ Protect routes (only authenticated users)
router.use(authController.protect);

router.post('/:id/register', eventController.registerForEvent);
router.post('/:id/unregister', eventController.unregisterFromEvent);

// ✅ Restrict image upload & event modifications to admin only
router.use(authController.restrictTo('admin'));

router.post('/', eventController.createEvent);

// ✅ Upload and update event image
router.patch(
  '/upload/:id',
  eventController.uploadEventImage,
  eventController.resizeEventImage,
  eventController.updateEventImage
);

router
  .route('/:id')
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEvent);

module.exports = router;
