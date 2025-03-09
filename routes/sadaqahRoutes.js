const express = require('express');
const sadaqahController = require('../controllers/sadaqahController');
const authController = require('../controllers/authController');

const router = express.Router();

// ✅ Public routes
router.get('/', sadaqahController.getAllSadaqah); 
router.get('/:id', sadaqahController.getSadaqah); 


router.use(authController.protect);

router.post('/', sadaqahController.createSadaqah);

// ✅ Restrict update & delete to admin
router.use(authController.restrictTo('admin'));

router
  .route('/:id')
  .patch(sadaqahController.updateSadaqah) 
  .delete(sadaqahController.deleteSadaqah); 

module.exports = router;
