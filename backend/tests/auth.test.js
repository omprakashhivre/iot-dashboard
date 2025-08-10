const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const createApp = require('../src/app');
const User = require('../src/models/user.model');
const bcrypt = require('bcrypt');

let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  app = createApp();
  // seed one user
  const pw = await bcrypt.hash('testpass', 10);
  await User.create({ username: 'test', passwordHash: pw, role: 'admin' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

test('login returns token', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'test', password: 'testpass' })
    .expect(200);
  expect(res.body.token).toBeDefined();
});
