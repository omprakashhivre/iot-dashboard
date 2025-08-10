const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const logger = require('../utils/logger');

function authenticateJWT(req, res, next) {
  const auth = req.header('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    return next();
  } catch (err) {
    logger.warn('Auth failed: ' + err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { authenticateJWT };
