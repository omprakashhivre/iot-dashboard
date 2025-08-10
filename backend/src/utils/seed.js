const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const logger = require('./logger');

async function seedUsers() {
  const existing = await User.findOne({ username: 'admin' });
  if (existing) {
    logger.info('Seed: users already exist, skipping seed.');
    return;
  }

  const saltRounds = 10;
  const adminPass = await bcrypt.hash('Admin@123', saltRounds);
  const userPass = await bcrypt.hash('User@123', saltRounds);

  await User.create([
    { username: 'admin', passwordHash: adminPass, role: 'admin' },
    { username: 'user', passwordHash: userPass, role: 'user' }
  ]);
  logger.info('Seeded admin and user accounts: admin/Admin@123, user/User@123');
}

module.exports = { seedUsers };
