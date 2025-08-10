# IoT Dashboard Backend (Express + Mongo + Socket.IO)

## Quick Start (with Docker)
1. Copy `.env.example` to `.env` and edit if required.
2. `docker-compose up --build`
3. API: http://localhost:4000/api
4. Socket.IO: ws://localhost:4000

### Seeded users
- admin / Admin@123 (role: admin)
- user / User@123 (role: user)

### Important endpoints
- POST /api/auth/login { username, password } -> { token }
- GET /api/sensors/latest
- GET /api/sensors/history?limit=100
- POST /api/sensors  (admin only)
- DELETE /api/sensors/:id (admin only)

### Notes
- Mock generator inserts a sensor document every `MOCK_INTERVAL_MS` ms (default 2000ms) and emits `sensor:update` via Socket.IO.
- Use the JWT token from login in `Authorization: Bearer <token>`.
