# ✅ TaskFlow Management System

A **full-stack task management application** built with Java Spring Boot and React.js, featuring JWT-based authentication, per-user data isolation, and real-time task tracking with a clean dark-themed UI.

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square)
![JWT](https://img.shields.io/badge/Auth-JWT-purple?style=flat-square)

---

## 📸 Preview

> Login screen → Dashboard with task cards, status filters, and live stats

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with bcrypt password hashing and signed JWT tokens
- 📋 **Full Task CRUD** — Create, read, update, and delete tasks
- 🔄 **Status Tracking** — Move tasks through TODO → IN PROGRESS → DONE
- 🎯 **Priority Levels** — Tag tasks as Low, Medium, or High priority
- 🔒 **Data Isolation** — Users can only access their own tasks (enforced at DB query level)
- 📊 **Live Stats Dashboard** — Real-time counts of total, todo, in-progress, and done tasks
- 🔍 **Filter by Status** — Instantly filter tasks by their current status
- 📱 **Responsive UI** — Works on desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Java 17 |
| Backend Framework | Spring Boot 3.2 |
| Security | Spring Security + JWT (jjwt 0.11.5) |
| ORM | Spring Data JPA + Hibernate |
| Database | MySQL 8 |
| Frontend | React.js 18 |
| HTTP Client | Axios |
| Build Tool | Maven |

---

## 📁 Project Structure

```
── taskflow-backend/
│   └── src/main/java/com/nupur/taskflow/
│       ├── model/
│       │   ├── User.java               # User entity (id, username, password)
│       │   └── Task.java               # Task entity (title, desc, status, priority)
│       ├── repository/
│       │   ├── UserRepository.java
│       │   └── TaskRepository.java
│       ├── service/
│       │   ├── UserService.java        # Register, login logic
│       │   └── TaskService.java        # CRUD + stats logic
│       ├── controller/
│       │   ├── AuthController.java     # /auth/register, /auth/login
│       │   └── TaskController.java     # /tasks endpoints
│       ├── security/
│       │   ├── JwtUtil.java            # Token generation + validation
│       │   ├── JwtFilter.java          # Intercepts every request
│       │   └── SecurityConfig.java     # Spring Security configuration
│       └── dto/
│           ├── AuthRequest.java
│           └── AuthResponse.java
│
── taskflow-frontend/
    └── src/
        └── App.js                      # Full React app (auth + dashboard)
```

---

## ⚙️ How to Run Locally

### Prerequisites
- Java 17+
- Maven 3.x
- MySQL 8
- Node.js 18+

---

### Backend Setup

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/taskflow-backend.git
cd taskflow-backend
```

**2. Create the database**
```sql
CREATE DATABASE taskflow_db;
```

**3. Configure credentials**

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskflow_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

**4. Run the backend**
```bash
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`

---

### Frontend Setup

**1. Clone the frontend**
```bash
git clone https://github.com/YOUR_USERNAME/taskflow-frontend.git
cd taskflow-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the app**
```bash
npm start
```
Frontend runs on `http://localhost:3000`

> ⚠️ Make sure the backend is running before starting the frontend.

---

## 📬 API Reference

### Auth Endpoints (Public)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | `{ username, password }` | Register new user, returns JWT |
| POST | `/auth/login` | `{ username, password }` | Login, returns JWT |

### Task Endpoints (JWT Required)

All task endpoints require the header:
```
Authorization: Bearer <your_jwt_token>
```

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/tasks` | — | Get all tasks for logged-in user |
| POST | `/tasks` | `{ title, description, priority, status }` | Create new task |
| PUT | `/tasks/{id}` | `{ title, description, priority, status }` | Update a task |
| DELETE | `/tasks/{id}` | — | Delete a task |
| GET | `/tasks/stats` | — | Get task counts by status |

---

## 🔐 How JWT Authentication Works

```
User logs in
     │
     ▼
Server validates username + password (bcrypt compare)
     │
     ▼
Server generates signed JWT token containing username
     │
     ▼
Client stores token in localStorage
     │
     ▼
Every API request sends: Authorization: Bearer <token>
     │
     ▼
JwtFilter intercepts → validates signature → extracts username
     │
     ├── Invalid token → 401 Unauthorized
     └── Valid token   → request proceeds, user identity injected
```

No session storage on the server — fully **stateless and scalable**.

---

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id       BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL        -- bcrypt hashed
);

-- Tasks table
CREATE TABLE tasks (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(50) DEFAULT 'TODO',       -- TODO | IN_PROGRESS | DONE
  priority    VARCHAR(50) DEFAULT 'MEDIUM',      -- LOW | MEDIUM | HIGH
  created_at  DATETIME,
  updated_at  DATETIME,
  user_id     BIGINT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

> Tables are auto-created by Hibernate on first run — no manual SQL needed.

---

## 📈 Future Improvements

- **Task due dates** with overdue highlighting
- **Team collaboration** — assign tasks to other users
- **Email notifications** for task deadlines
- **Drag-and-drop** Kanban board view
- **Docker support** — containerize backend + MySQL
- **Pagination** for large task lists
  
<img width="1072" height="805" alt="Screenshot 2026-05-23 230744" src="https://github.com/user-attachments/assets/66812e83-9ba7-49a7-b7c1-502bfd190f5f" />

<img width="1893" height="674" alt="Screenshot 2026-05-23 231653" src="https://github.com/user-attachments/assets/69674b00-2f45-4fe5-a657-f583280318b0" />
<img width="1877" height="940" alt="Screenshot 2026-05-23 231713" src="https://github.com/user-attachments/assets/1a999deb-a355-4a58-9e02-1706c2ac7210" />
<img width="1865" height="576" alt="Screenshot 2026-05-23 231728" src="https://github.com/user-attachments/assets/1fd8ea5f-46cc-438d-b20f-5f37a4f3a3f1" />
<img width="1132" height="696" alt="Screenshot 2026-05-23 231751" src="https://github.com/user-attachments/assets/b480a00d-5ef8-4c19-b6e1-c483aa7ba3ce" />

