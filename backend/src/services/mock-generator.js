const Sensor = require('../models/sensor.model');
const { mockInterval } = require('../config');
const logger = require('../utils/logger');

function randomBetween(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

function startMockGenerator(io, options = {}) {
  const deviceId = options.deviceId || 'device-1';
  logger.info('Starting mock generator, interval=' + mockInterval + 'ms');

  const timer = setInterval(async () => {
    const reading = {
      deviceId,
      temperature: randomBetween(15, 35), // Celsius
      humidity: randomBetween(20, 90),    // %
      powerUsage: randomBetween(10, 150)  // Watts
    };

    try {
      const doc = await Sensor.create(reading);
      if (io) io.emit('sensor:update', doc);
      logger.info(`Mock inserted: temp=${doc.temperature}C hum=${doc.humidity}% power=${doc.powerUsage}W`);
    } catch (err) {
      logger.error('Mock generator insert error: ' + err.message);
    }
  }, mockInterval);

  return () => clearInterval(timer);
}

module.exports = { startMockGenerator };
