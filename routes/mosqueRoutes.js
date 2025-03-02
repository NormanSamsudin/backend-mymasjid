const express = require('express');
const mosqueController = require('./../controllers/mosqueController');
const authController = require('../controllers/authController');

const mosqueRoutes = express.Router();

// Public routes (no authentication required)
mosqueRoutes.get('/', mosqueController.getAllMosques); // Get all mosques
mosqueRoutes.get('/:id', mosqueController.getMosque); // Get a single mosque by ID

// // Protect all routes after this middleware
// mosqueRoutes.use(authController.protect);

// // Routes for logged-in users (mosque admins)
// mosqueRoutes.patch('/updateMyPassword', authController.updatePassword); // Update password for logged-in admin
// mosqueRoutes.get('/me', mosqueController.getMyMosque, mosqueController.getMosque); // Get the current mosque (based on logged-in admin)
// mosqueRoutes.patch(
//   '/updateMe',
//   mosqueController.uploadMosquePhoto,
//   mosqueController.resizeMosquePhoto,
//   mosqueController.updateMyMosque
// ); // Update mosque details (for logged-in admin)
// mosqueRoutes.patch('/deactivateMe', mosqueController.deactivateMosque); // Deactivate the current mosque (soft delete)

// // Restrict the following routes to 'admin' role
mosqueRoutes.use(authController.restrictTo('admin-masjid'));

// Admin-only routes
mosqueRoutes.post('/', mosqueController.createMosque); // Create a new mosque (admin only)
mosqueRoutes
  .route('/:id')
  .patch(mosqueController.updateMosque) // Update a mosque (admin only)
  .delete(mosqueController.deleteMosque); // Delete a mosque permanently (admin only)

module.exports = mosqueRoutes;