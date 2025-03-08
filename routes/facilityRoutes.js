const express = require('express');
const facilityController = require('./../controllers/facilityController');
const authController = require('../controllers/authController');

const facilityRoutes = express.Router();

// Public routes (no authentication required)
facilityRoutes.get('/', facilityController.getAllFacilities); // Get all facilities
facilityRoutes.get('/:id', facilityController.getFacility); // Get a single facility by ID

facilityRoutes.patch(
  '/upload/:id',
  facilityController.updateFacility,
  facilityController.resizeFacilityPhoto,
  facilityController.updateFacilityImage
); // Update facility details (admin only)

// Restrict the following routes to 'admin' role
facilityRoutes.use(authController.restrictTo('admin-masjid'));

// Admin-only routes
facilityRoutes.post('/', facilityController.createFacility); // Create a new facility (admin only)
facilityRoutes
  .route('/:id')
  .patch(facilityController.updateFacility) // Update a facility (admin only)
  .delete(facilityController.deleteFacility); // Delete a facility permanently (admin only)

module.exports = facilityRoutes;
