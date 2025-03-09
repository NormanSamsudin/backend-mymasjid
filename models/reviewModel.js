const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review cannot be empty'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'A review must have a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility', // Reference to Facility model
      required: [true, 'Review must belong to a facility'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: [true, 'Review must have an author'],
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews from the same user for the same facility
//reviewSchema.index({ facility: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
