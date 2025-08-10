const express = require('express');
const { createSensor, getLatest, getHistory, deleteSensor } = require('../controllers/sensor.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/rbac.middleware');

const router = express.Router();

// create - authenticated (could also allow without auth if devices push)
router.post('/', authenticateJWT, permit('admin'), createSensor); // only admin can create via API in this default setup
// but if you want devices to push without auth, remove middlewares or create a separate public route

router.get('/latest', authenticateJWT, permit('admin', 'user'), getLatest);
router.get('/history', authenticateJWT, permit('admin', 'user'), getHistory);
router.delete('/:id', authenticateJWT, permit('admin'), deleteSensor);

module.exports = router;
