const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility', // Reference to Facility model
      required: [true, 'Booking must be linked to a facility'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: [true, 'Booking must be linked to a user'],
    },
    date: {
      type: Date,
      required: [true, 'Booking must have a date'],
    },
    startTime: {
      type: String,
      required: [true, 'Booking must have a start time'],
    },
    endTime: {
      type: String,
      required: [true, 'Booking must have an end time'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: 'default.jpg', // Optional: Proof of booking payment
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
