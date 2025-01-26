const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xxs = require('xss-clean');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const healthRouter = require('./routes/healthRoutes');
const secureHeaders = require('./utils/security/secureHeader');
const limiter = require('./utils/security/limiter');
const { morganMiddleware } = require("./utils/security/logger");

const app = express();

app.use(helmet());
app.use('/api', limiter);
app.use(mongoSanitize());
app.use(xxs());
app.use(secureHeaders);
app.use(express.json({ limit: '10kb' }));
app.use(morganMiddleware); 
app.use('/public', express.static('public'));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/health', healthRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
