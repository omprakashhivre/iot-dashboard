Here’s an expanded `README.md` for your IoT Dashboard with more POC details, explanation of flow, and usage notes:

---

# IoT Dashboard

A full-stack **real-time IoT monitoring dashboard** with role-based access control, built as a Proof of Concept (POC) using **Express.js**, **Next.js**, **MongoDB**, and **Socket.IO**.  
The system simulates sensor data and streams updates live to connected clients, while also storing historical data for reporting.  
Fully containerized with Docker for a seamless local setup.

---

## 📌 POC Overview

The IoT Dashboard demonstrates how **IoT sensor data** can be collected, stored, processed, and visualized in real-time while maintaining **secure user access** via role-based permissions.

**Key Points of the POC:**
1. **Simulated IoT Devices**  
   A mock generator inserts new temperature, humidity, and power usage readings every few seconds into the database and broadcasts them to all connected clients via WebSockets.

2. **Live & Historical Data**  
   - **Live:** Users see sensor updates instantly without refreshing the page.  
   - **Historical:** Data is persisted in MongoDB for future queries and chart visualization.

3. **Role-Based Access Control (RBAC)**  
   - **Admin:** Can view and insert data (full CRUD if extended).  
   - **User:** Can only view existing data.  
   This ensures sensitive operations are restricted to authorized users.

4. **Authentication**  
   - Uses **JWT tokens** for session management.  
   - Tokens are issued at login and required for protected API calls.

5. **Full-Stack in Containers**  
   - MongoDB, Backend, and Frontend each run in their own container via Docker Compose.  
   - No manual environment setup required—just run `docker-compose up`.

---

## 🚀 Features

- **Real-time updates** with WebSockets (Socket.IO)
- **JWT authentication** for secure access
- **RBAC** for fine-grained permissions
- **Data visualization** using charts (Recharts)
- **Dark/Light mode** for better UX
- **MongoDB persistence** for historical trends
- **Dockerized** for simple deployment and testing

---

## 🛠 Tech Stack

**Backend**
- Node.js (Express.js)
- MongoDB (Mongoose)
- Socket.IO
- JWT Auth

**Frontend**
- Next.js
- TailwindCSS
- Recharts (for graphs)

**DevOps**
- Docker & Docker Compose

---

## ⚡ How It Works

### 1. Data Flow
1. **Mock Data Generator** (inside backend) periodically inserts sensor readings into MongoDB.
2. Each insertion triggers a **WebSocket broadcast** to all connected clients.
3. Clients update their dashboards in real-time without page reloads.
4. Data is stored in MongoDB and available for historical queries via REST APIs.

### 2. User Flow
1. **Login** with admin or user credentials.
2. Dashboard connects to the WebSocket endpoint and starts receiving live updates.
3. Depending on the role:
   - **Admin:** Can trigger data creation or perform management actions.
   - **User:** Can only view the dashboard and history.

---

## ⚙️ Quick Start

### Prerequisites
- [Docker](https://www.docker.com/) installed

### Steps
```bash
# Clone repo
git clone https://github.com/YOUR_USERNAME/iot-dashboard.git
cd iot-dashboard

# Run containers
docker-compose up --build
````

**Backend:** [http://localhost:4007](http://localhost:4007)
**Frontend:** [http://localhost:3007](http://localhost:3007)

---

### 🔑 Default Users

```
Admin: admin / admin123
User: user / user123
```

---

### 📡 API Endpoints

**Auth**

* `POST /auth/login` – Authenticate user
* `POST /auth/register` – Create new user

**Sensors**

* `GET /api/sensors` – Fetch historical sensor data (all roles)
* `POST /api/sensors` – Create sensor data (admin only)

**Health Check**

* `GET /health` – Check backend status

**WebSocket**

* `ws://localhost:4007`

---

## 🐳 Docker Setup

The `docker-compose.yml` starts:

1. **MongoDB** – stores all data
2. **Backend** – Express.js API + WebSocket server
3. **Frontend** – Next.js dashboard

**Example Command:**

```bash
docker-compose up --build
```

This will:

* Install dependencies in isolated containers
* Start MongoDB
* Start backend & frontend linked to the database
* Serve the app locally with zero manual setup

---

## 📽 Demo Video

Due to limited time, the demo video could not be recorded before submission. However, running the `docker-compose up` command will fully replicate the working environment for review.

---

## 📂 Project Structure

```
iot-dashboard/
│
├── backend/           # Express.js API + WebSocket server
│   ├── src/
│   ├── package.json
│   └── ...
│
├── frontend/          # Next.js dashboard
│   ├── pages/
│   ├── components/
│   ├── package.json
│   └── ...
│
├── docker-compose.yml # Orchestrates the containers
└── README.md          # Project documentation
```

---

## 🔮 Possible Improvements

* Connect to real IoT devices instead of mock generator
* Implement historical trends with time-range filters
* Add user management UI
* Deploy to cloud (AWS/GCP/Azure) for production testing

---

## 👤 Author

**\[Omprakash hivre]** – Full-Stack Developer
[GitHub Profile](https://github.com/omprakashhivre)


