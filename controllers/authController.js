const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const {sendOtpEmail} = require('./../utils/email');

const signToken = (id, tokenType) => {
  const secret = tokenType === 'access' ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET;
  const expiresIn = tokenType === 'access' ? process.env.JWT_ACCESS_EXPIRES_IN : process.env.JWT_REFRESH_EXPIRES_IN;

  return jwt.sign({ id }, secret, {
    expiresIn,
  });
};

const createSendToken = (user, statusCode, res) => {
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_ACCESS_EXPIRES_IN || !process.env.JWT_COOKIE_EXPIRES_IN || !process.env.JWT_REFRESH_SECRET || !process.env.JWT_REFRESH_EXPIRES_IN) {
    return next(new AppError('JWT environment variables are not properly configured.', 500));
  }

  const accessToken = signToken(user, 'access');
  const refreshToken = signToken(user, 'refresh');

  // Set cookie options (browser)
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // Send refresh token as a cookie
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Remove the password from the output
  user.password = undefined;

  // Send response with access token and user data
  res.status(statusCode).json({
    status: 'success',
    accessToken,
    refreshToken,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: 'user',
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Use createSendToken to send tokens
  createSendToken(user, 200, res);
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  // Get refresh token from cookies
  const refreshToken =  req.body.refreshToken;

  if (!refreshToken) {
    return next(new AppError('No refresh token provided', 401));
  }

  // Verify the refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return next(new AppError('Invalid or expired refresh token', 401));
  }

  // Check if the user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('User no longer exists', 401));
  }

  // Generate a new access token
  const accessToken = signToken(currentUser, 'access');

  // Generate a new refresh token
  const newRefreshToken = signToken(currentUser, 'refresh');

  // Set cookie options for the new refresh token
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // Send the new refresh token as a cookie
  res.cookie('refreshToken', newRefreshToken, cookieOptions);

  // Send the new access token to the client
  res.status(200).json({
    status: 'success',
    accessToken,
    refreshToken: newRefreshToken
  });
});

//middleware to protect routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  // get token from request header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') // kita nak tetapkan format utk auth
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  // 2) Check if token is valid
  // use promisify to make return of promise
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // die akan ada dua error invalid signature and expired token

  // 3) Check if user still exist,
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check is user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  req.user = freshUser;
  //grant access to the protected route
  next();
});

// middleware with parameters
// it will recieve the parameter as array
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles = ['admin', 'guide-lead']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

//handler for forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // to deactivate all the validator of "email is required"

  // 3) Send it to user's email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetUrl}.\n If you didn't forget your password please ignore this email !!`;

  try {
    await sendOtpEmail({
      email: user.email, // target email to send token
      subject: 'Your password reset token (valid for 10 minutes)', //title of the email
      message //content within the email
    });

    //response from the server
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (err) {
    // if got error then no token generated and save in the database
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

//handler for reset password

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() } // making sure token is not excess time to use
  });

  //2) if token is not expired, and there is user , then set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

// if logged in user want to change password
// willrequired current password before updating the passoword
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) get user from the collection
  const user = await User.findById(req.user.id).select('+password'); //concatination field

  //2) check if the POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('Your current password is wrong', 401));

  //3) If so, update the password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  //4) Log user in, send JWT
  createSendToken(user, 200, res);
});
