const winston = require("winston");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, `${process.env.NODE_ENV}.log`),
    }),
  ],
});

const morganMiddleware = morgan(
  (tokens, req, res) => {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      content_length: tokens.res(req, res, "content-length"),
      response_time: tokens["response-time"](req, res),
      ip: req.ip, 
    });
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        logger.info("HTTP request", data);
      },
    },
  }
);

module.exports = { logger, morganMiddleware };