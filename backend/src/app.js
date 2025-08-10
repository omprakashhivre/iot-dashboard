const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const sensorRoutes = require('./routes/sensor.routes');
const logger = require('./utils/logger');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/sensors', sensorRoutes);

  // health
  app.get('/health', (req, res) => {
    res.json({ ok: true, ts: Date.now() });
  });

  // basic error handler
  app.use((err, req, res, next) => {
    logger.error(err.stack || err.message);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}

module.exports = createApp;
