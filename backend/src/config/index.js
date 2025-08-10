const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 4000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/iotdb',
  jwtSecret: process.env.JWT_SECRET || 'change_this_jwt_secret',
  mockInterval: parseInt(process.env.MOCK_INTERVAL_MS || '2000', 10)
};
