const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// ✅ Protect all routes (only logged-in users can book)
router.use(authController.protect);

// ✅ Users can create and view their bookings
router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBooking);
router.post('/', bookingController.createBooking);

// ✅ Users can upload proof of booking
router.patch(
  '/upload/:id',
  bookingController.uploadBookingImage,
  bookingController.resizeBookingImage,
  bookingController.updateBooking
);

// ✅ Restrict the following routes to admins only
router.use(authController.restrictTo('admin'));

router.patch('/:id', bookingController.updateBooking);
router.patch('/:id/status', bookingController.changeBookingStatus);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
