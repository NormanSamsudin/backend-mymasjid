const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const reviewRoutes = express.Router({ mergeParams: true });

// Public Routes (Get all reviews or a single review)
reviewRoutes.get('/', reviewController.getAllReviews);
reviewRoutes.get('/:id', reviewController.getReview);

// Restrict the following routes to authenticated users
reviewRoutes.use(authController.protect);

// Users can only create/update/delete their own reviews
reviewRoutes.post(
  '/',
  reviewController.setFacilityUserIds, // Automatically set `facility` and `user`
  reviewController.createReview
);
reviewRoutes.patch('/:id', reviewController.updateReview);
reviewRoutes.delete('/:id', reviewController.deleteReview);

module.exports = reviewRoutes;
