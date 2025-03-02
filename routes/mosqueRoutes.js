const express = require('express');
const mosqueController = require('./../controllers/mosqueController');
const authController = require('../controllers/authController');

const mosqueRoutes = express.Router();

// Public routes (no authentication required)
mosqueRoutes.get('/', mosqueController.getAllMosques); // Get all mosques
mosqueRoutes.get('/:id', mosqueController.getMosque); // Get a single mosque by ID

mosqueRoutes.patch(
  '/upload/:id',
  mosqueController.uploadMosquePhoto,
  mosqueController.resizeMosquePhoto,
  mosqueController.updateMosqueImage
); // Update mosque details admin only)

// Restrict the following routes to 'admin' role
mosqueRoutes.use(authController.restrictTo('admin-masjid'));

// Admin-only routes
mosqueRoutes.post('/', mosqueController.createMosque); // Create a new mosque (admin only)
mosqueRoutes
  .route('/:id')
  .patch(mosqueController.updateMosque) // Update a mosque (admin only)
  .delete(mosqueController.deleteMosque); // Delete a mosque permanently (admin only)

module.exports = mosqueRoutes;