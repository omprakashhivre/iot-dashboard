const Sensor = require('../models/sensor.model');

async function createSensor(req, res) {
  // any authenticated admin or external device can POST new reading
  const { deviceId, temperature, humidity, powerUsage, timestamp } = req.body;
  if (temperature == null || humidity == null || powerUsage == null) {
    return res.status(400).json({ message: 'temperature, humidity, powerUsage required' });
  }
  const doc = await Sensor.create({ deviceId, temperature, humidity, powerUsage, timestamp: timestamp || Date.now() });
  // emit via socket stored on req.app.get('io') if available
  const io = req.app.get('io');
  if (io) io.emit('sensor:update', doc);
  return res.status(201).json(doc);
}

async function getLatest(req, res) {
  const doc = await Sensor.findOne().sort({ timestamp: -1 });
  return res.json(doc);
}

async function getHistory(req, res) {
  // pagination + optional device/time filters
  const { limit = 100, deviceId, from, to } = req.query;
  const query = {};
  if (deviceId) query.deviceId = deviceId;
  if (from || to) query.timestamp = {};
  if (from) query.timestamp.$gte = new Date(from);
  if (to) query.timestamp.$lte = new Date(to);

  const docs = await Sensor.find(query).sort({ timestamp: -1 }).limit(Math.min(parseInt(limit, 10), 1000));
  return res.json(docs);
}

async function deleteSensor(req, res) {
  const { id } = req.params;
  const doc = await Sensor.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  return res.json({ message: 'deleted', id: doc._id });
}

module.exports = { createSensor, getLatest, getHistory, deleteSensor };
