# TaskFlow — Task Management Web Application

A full-stack task management app built with **React.js**, **Node.js + Express**, and **MongoDB**. Users can sign up, log in, and manage their personal tasks with filtering, search, pagination, dark mode, and a responsive UI.

> Submitted as the Full Stack Developer assignment (React + Node, 2–4 years experience, 48-hour deadline).

---

## ✨ Features

### Core
- Email/password **signup & login** with bcrypt + JWT
- **Dashboard** with task stats (total / pending / completed)
- **Create**, **edit**, and **delete** tasks
- Toggle tasks between **Completed** and **Pending**
- Filter tasks by **All / Pending / Completed**
- Form validation on both client and server
- Fully **responsive** UI for desktop and mobile
- Protected client and server routes (JWT)
- Centralized error handling with structured error responses

### Bonus included
- 🌙 **Dark mode** toggle with system-preference detection and persistence
- 🔍 **Search** across task title and description
- 📄 **Pagination** (server-side, configurable page size)
- 📚 **Swagger / OpenAPI** docs at `/api-docs`
- 🎯 **Priority** and **due-date** support on tasks
- ⚡ Optimistic UI updates on toggle for instant feedback

---

## 🧱 Tech Stack

| Layer       | Choice                                                              |
| ----------- | ------------------------------------------------------------------- |
| Frontend    | React 18 (Vite) · React Router · Tailwind CSS · Axios · react-hot-toast |
| State       | React Context API (Auth + Theme)                                    |
| Backend     | Node.js · Express 4 · Mongoose · JWT · bcryptjs · express-validator |
| Database    | MongoDB                                                             |
| API Docs    | Swagger (swagger-jsdoc + swagger-ui-express)                        |
| Tooling     | Vite · Nodemon · Morgan · CORS                                      |

---

## 📂 Project Structure

```
task-management/
├── backend/
│   ├── src/
│   │   ├── config/db.js              # MongoDB connection
│   │   ├── controllers/              # Route handlers (auth, tasks)
│   │   ├── middleware/               # auth, validate, errorHandler
│   │   ├── models/                   # User, Task (Mongoose schemas)
│   │   ├── routes/                   # /api/auth, /api/tasks (with OpenAPI JSDoc)
│   │   ├── docs/swagger.js           # Swagger spec
│   │   ├── utils/generateToken.js
│   │   ├── app.js                    # Express app (no listen)
│   │   └── server.js                 # Entrypoint
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, Modal, TaskItem, TaskForm, ...
│   │   ├── pages/                    # Login, Signup, Dashboard, NotFound
│   │   ├── context/                  # AuthContext, ThemeContext
│   │   ├── services/api.js           # Axios client + endpoint wrappers
│   │   ├── utils/validators.js
│   │   ├── App.jsx                   # Routes
│   │   ├── main.jsx                  # Providers + bootstrap
│   │   └── index.css                 # Tailwind + component classes
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ and **npm**
- **MongoDB** running locally (or a hosted cluster like Atlas)

### 1. Clone & install

```bash
git clone <repo-url>
cd task-management

# Backend
cd backend
cp .env.example .env       # then edit values
npm install

# Frontend (in a separate terminal)
cd ../frontend
cp .env.example .env       # default points at http://localhost:5000/api
npm install
```

### 2. Configure environment

**`backend/.env`**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/task_management
JWT_SECRET=replace-this-with-a-long-random-string
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

**`frontend/.env`**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run

```bash
# Terminal 1 — API
cd backend
npm run dev          # nodemon on http://localhost:5000

# Terminal 2 — Web
cd frontend
npm run dev          # Vite on http://localhost:5173
```

Open **http://localhost:5173**, sign up, and start adding tasks.
Swagger docs: **http://localhost:5000/api-docs**

---

## 🔐 Authentication

- Passwords are hashed with **bcryptjs** (10 salt rounds).
- On signup/login, the API returns a **JWT** (default `7d` expiry).
- The frontend stores the token in `localStorage` and attaches it to every request via an Axios request interceptor (`Authorization: Bearer <token>`).
- A response interceptor logs the user out on `401`.
- All `/api/tasks/*` routes are gated by the `protect` middleware, which verifies the JWT and loads the user.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

All responses follow this shape:
```json
{ "success": true, "data": ..., "pagination": { ... } }
```
Errors:
```json
{ "success": false, "message": "...", "errors": [{ "field": "email", "message": "..." }] }
```

### Auth

| Method | Endpoint            | Auth | Description                          |
| ------ | ------------------- | ---- | ------------------------------------ |
| POST   | `/auth/signup`      | —    | Register `{ name, email, password }` |
| POST   | `/auth/login`       | —    | Returns `{ user, token }`            |
| GET    | `/auth/me`          | ✅    | Returns the authenticated user       |

### Tasks (all require `Authorization: Bearer <token>`)

| Method | Endpoint                  | Description                              |
| ------ | ------------------------- | ---------------------------------------- |
| GET    | `/tasks`                  | List tasks with filters & pagination     |
| GET    | `/tasks/stats`            | Counts by status (total/pending/completed) |
| GET    | `/tasks/:id`              | Get a single task                        |
| POST   | `/tasks`                  | Create a task                            |
| PUT    | `/tasks/:id`              | Update a task                            |
| PATCH  | `/tasks/:id/toggle`       | Toggle status (pending ↔ completed)      |
| DELETE | `/tasks/:id`              | Delete a task                            |

**`GET /tasks` query params**

| Param      | Type     | Description                                              |
| ---------- | -------- | -------------------------------------------------------- |
| `status`   | `pending` \| `completed` | Filter by status                         |
| `priority` | `low` \| `medium` \| `high` | Filter by priority                    |
| `search`   | string   | Case-insensitive search across title & description       |
| `page`     | int      | Default `1`                                              |
| `limit`    | int      | Default `10`, max `100`                                  |
| `sort`     | string   | `createdAt` (default) \| `updatedAt` \| `dueDate` \| `priority` \| `title` |
| `order`    | `asc` \| `desc` (default) |                                       |

**Task payload**

```json
{
  "title": "Ship the assignment",
  "description": "Optional details",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-05-29T00:00:00.000Z"
}
```

The interactive Swagger UI is available at `GET /api-docs` and the raw OpenAPI JSON at `GET /api-docs.json`.

---

## 🗄️ Database Design

**User**
```
{ _id, name, email (unique, lowercased), password (bcrypt, select:false),
  createdAt, updatedAt }
```

**Task**
```
{ _id, user (ref: User, indexed), title, description,
  status: 'pending'|'completed', priority: 'low'|'medium'|'high',
  dueDate: Date|null, createdAt, updatedAt }
```

Indexes:
- `Task { user: 1, status: 1, createdAt: -1 }` — fast user-scoped list queries
- `Task { title: 'text', description: 'text' }` — text search support

---

## 🎨 UI Notes

- Mobile-first, fully responsive layout (Tailwind utility classes).
- **Dark mode**: class-based (`darkMode: 'class'`), persisted in `localStorage`, honors `prefers-color-scheme` on first load.
- Toast notifications via `react-hot-toast` for success and error states.
- Optimistic UI on task toggle — instant feedback, reverts on failure.
- Empty states, loading spinners, and accessible modals.

---

## 🧪 Manual Test Plan

1. **Signup** → creates account, lands on dashboard.
2. **Logout & Login** → returns to dashboard.
3. **Login with bad password** → 401 toast.
4. **Create task** with title, description, priority, due date.
5. **Toggle** task to completed → moves to "Completed" stat.
6. **Filter** by Pending / Completed / All.
7. **Search** — type a keyword, list filters after ~350ms debounce.
8. **Edit** a task — title/priority/due date update in place.
9. **Delete** with confirmation modal.
10. **Pagination** appears when total > page size (8).
11. **Dark mode** toggle persists across reloads.
12. Visit `/api-docs` and try endpoints with a Bearer token.

---

## 🤔 Assumptions

- Single-tenant: each user only sees their own tasks (enforced by `user` field on every query).
- JWT is stored in `localStorage` for simplicity (in production, prefer an httpOnly cookie).
- No email verification or password reset flow (out of scope for the assignment).
- Default page size is **8** on the dashboard for visual balance; the API supports up to 100.
- Search is a case-insensitive substring (regex) match, not full-text — works well at small/medium scale and keeps the local dev experience zero-config. The schema includes a text index for an easy upgrade.
- No Docker / deployment configs included; the project runs locally with two `npm run dev` commands.
- No automated tests; manual test plan above covers the happy paths and primary edge cases.

---

## 📜 License

For evaluation purposes only.
# Task-Management-App
