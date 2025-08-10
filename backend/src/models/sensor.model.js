const mongoose = require('mongoose');

const SensorSchema = new mongoose.Schema({
  deviceId: { type: String, default: 'device-1' },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  powerUsage: { type: Number, required: true }, // watts
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Sensor = mongoose.model('Sensor', SensorSchema);
module.exports = Sensor;
