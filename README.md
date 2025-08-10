# IoT Dashboard

A full-stack real-time IoT monitoring dashboard with role-based access, built using **Express.js**, **Next.js**, **MongoDB**, and **Socket.IO**.  
Containerized with Docker for quick setup.

## Features
- Real-time sensor data updates via WebSockets
- Historical data visualization (temperature, humidity, power usage)
- Role-Based Access Control (RBAC):
  - **Admin**: Full access (CRUD)
  - **User**: Read-only
- JWT authentication
- Responsive dashboard with dark/light mode
- Dockerized local environment with `docker-compose`

## Tech Stack
- **Backend**: Node.js (Express), MongoDB, Socket.IO
- **Frontend**: Next.js, TailwindCSS, Recharts
- **Database**: MongoDB
- **Auth**: JWT
- **Containerization**: Docker & Docker Compose

## Quick Start

### Prerequisites
- [Docker](https://www.docker.com/) installed

### Steps
```bash
# Clone repo
git clone https://github.com/YOUR_USERNAME/iot-dashboard.git
cd iot-dashboard

# Run containers
docker-compose up --build

```

Backend will be available at: http://localhost:5000
Frontend will be available at: http://localhost:3000

### Default Users
```
Admin: admin / admin123

User: user / user123
```

### API Endpoints
-    POST /auth/login – Authenticate user

-   POST /auth/register – Create a new user (admin only)

-   GET /api/sensors – Fetch historical sensor data

-    POST /api/sensors – Create sensor data (admin only)

-   WebSocket: ws://localhost:5000



---

✅ With this setup:  
- `.gitignore` ensures no `node_modules` or `.env` gets pushed.  
- `docker-compose up --build` runs **MongoDB**, backend, and frontend.  
- Backend & frontend are networked together inside Docker.  
- README gives a **professional, clear** overview for reviewers.  

---

If you want, I can also give you a **MongoDB seed script** so when you run Docker, it **automatically** creates the two dummy users without manual DB insert. That will make your demo instant.  

Do you want me to prepare that seed script? That way, when they `docker-compose up`, both `admin` and `user` accounts exist.

---