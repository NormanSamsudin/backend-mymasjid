const express = require('express');
const committeeController = require('./../controllers/committeeController');
const authController = require('../controllers/authController');

const committeeRoutes = express.Router();

// Public routes (no authentication required)
committeeRoutes.get('/', committeeController.getAllCommittee); // Get all mosques
committeeRoutes.get('/:id', committeeController.getCommittee); // Get a single mosque by ID

committeeRoutes.patch(
  '/upload/:id',
  committeeController.updateCommittee,
  committeeController.resizeCommitteePhoto,
  committeeController.updateCommitteeImage
); // Update mosque details admin only)

// Restrict the following routes to 'admin' role
committeeRoutes.use(authController.restrictTo('admin-masjid'));

// Admin-only routes
committeeRoutes.post('/', committeeController.createCommittee); // Create a new mosque (admin only)
committeeRoutes
  .route('/:id')
  .patch(committeeController.updateCommittee) // Update a mosque (admin only)
  .delete(committeeController.deleteCommittee); // Delete a mosque permanently (admin only)

module.exports = committeeRoutes;