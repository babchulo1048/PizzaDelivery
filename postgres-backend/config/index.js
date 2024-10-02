require("dotenv").config(); // Load .env file

module.exports = {
  PORT: process.env.PORT || 3000, // Default to port 3000 if not provided in .env
  JWT_SECRET: process.env.JWT_SECRET,
  expiresIn: process.env.EXPIRED_IN,
};
