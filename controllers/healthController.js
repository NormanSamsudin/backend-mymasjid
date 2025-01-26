const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const nodemailer = require('nodemailer');

exports.dbCheck = catchAsync(async (req, res, next) => {
  // Check Mongoose connection state
  const mongoStatus = mongoose.connection.readyState; 
  const dbHealth = mongoStatus === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    status: 'success',
    server: 'running',
    database: dbHealth, 
  });
});

exports.trasporterCheck = catchAsync(async (req, res, next) => {

  const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

transporter.verify(function (error, success) {
  if (error) {
    return next(new AppError('❌ Mailtrap Connection Error:', 400));
  } else {
    res.status(200).json({
      status: 'success',
      server: 'running',
      mailtrap: '✅ Mailtrap is ready to send emails',
    });
  }
})});
