const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 90000000000000000000000000, // Limit each IP to 5 login attempts per windowMs
  message:
    'Too many login attempts from this IP, please try again after 15 minutes',
  handler: (req, res, next, options) => {
    // Log the IP address
    console.log(`Too many login attempts from IP: ${req.ip}`);

    // Respond with the message
    res.status(options.statusCode).send(options.message);
  }
});

module.exports = limiter;
