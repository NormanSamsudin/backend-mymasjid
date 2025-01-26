const os = require("os");

const getBaseUrl = (port) => {
  const HOST = os.hostname(); // Get the hostname of the machine
  const PROTOCOL = "http"; // Use 'https' if your server uses SSL/TLS

  // Construct the base URL
  const baseUrl = `${PROTOCOL}://${HOST}:${port}`;

  // Log the base URL for the health check endpoint
  console.log(`Health check endpoint: ${baseUrl}/health`);

  return baseUrl;
};

module.exports = getBaseUrl;