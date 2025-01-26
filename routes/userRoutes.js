const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('../controllers/authController');

const userRoutes = express.Router();

userRoutes.post('/signup' ,authController.signup);
userRoutes.post('/login', authController.login);
userRoutes.post('/refresh-token', authController.refreshToken);
userRoutes.post('/forgot-password', authController.forgotPassword);
userRoutes.patch('/resetPassword/:token', authController.resetPassword);
userRoutes.use(authController.protect);//protect all routes after this middleware is called
userRoutes.patch('/updateMyPassword', authController.updatePassword); // change password if the user loggedin
userRoutes.get('/me', userController.getMe, userController.getUser);
userRoutes.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
); // update user data if the user has logged in
userRoutes.delete('/deleteMe', userController.deleteMe); //change user to not active
userRoutes.use(authController.restrictTo('admin')); // only below router got effected
userRoutes
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRoutes
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRoutes;
