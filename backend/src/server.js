const http = require('http');
const mongoose = require('mongoose');
const createApp = require('./app');
const { port, mongoURI } = require('./config');
const logger = require('./utils/logger');
const { seedUsers } = require('./utils/seed');
const { startMockGenerator } = require('./services/mock-generator');

async function start() {
  await mongoose.connect(mongoURI, {});

  logger.info('Connected to MongoDB');

  // seed accounts
  await seedUsers();

  const app = createApp();
  const server = http.createServer(app);

  // setup socket.io
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  // share io via app so controllers can emit
  app.set('io', io);

  io.on('connection', (socket) => {
    logger.info('Socket connected: ' + socket.id);

    socket.on('subscribe', (payload) => {
      // e.g., subscribe to device channels in future
      logger.info(`Socket ${socket.id} subscribe: ${JSON.stringify(payload)}`);
    });

    socket.on('disconnect', () => logger.info('Socket disconnected: ' + socket.id));
  });

  // start mock generator which writes to DB and emits updates
  const stopMock = startMockGenerator(io);

  server.listen(port,"0.0.0.0", () => {
    logger.info(`Server listening on port ${port}`);
    logger.info('Socket.IO ready at /');
  });

  // handle graceful shutdown
  const shutdown = async () => {
    logger.info('Shutdown initiated');
    stopMock();
    await mongoose.disconnect();
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
