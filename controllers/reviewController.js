const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

// Middleware to set `facility` and `user` before creating a review
exports.setFacilityUserIds = (req, res, next) => {
  if (!req.body.facility) req.body.facility = req.params.facilityId; // Get facility from URL
  if (!req.body.user) req.body.user = req.user.id; // Get user from authentication
  next();
};

// Create a new review (User must be logged in)
exports.createReview = factory.createOne(Review);

// Get all reviews (optional filtering for a specific facility)
exports.getAllReviews = factory.getAll(Review);

// Get a single review by ID
exports.getReview = factory.getOne(Review);

// Update a review (only the review author can update)
exports.updateReview = factory.updateOne(Review);

// Delete a review (only the review author or admin can delete)
exports.deleteReview = factory.deleteOne(Review);
