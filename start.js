const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const baseUrl = require('./utils/baseUrl');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

const app = require('./app');

// Set environment
const environment = process.argv[2] || "development";
process.env.NODE_ENV = environment;
console.log(`Starting application in ${environment} mode...`);

// Load environment variables
const envPath = path.join(__dirname, "config", `${process.env.NODE_ENV}.env`);
console.log(`Loading environment variables from: ${envPath}`);
dotenv.config({ path: envPath });

// Connect to MongoDB
console.log("MongoDB URI:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.error("Error stack:", err.stack);
    process.exit(1);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
