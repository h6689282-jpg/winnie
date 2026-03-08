# MeetNow

A simple dating/matching app: decoupled backend (REST API with JWT auth) and React SPA frontend.

---

## Architecture Overview

```
project/
├── backend/          # Django backend (Python)
│   ├── apps/
│   │   ├── accounts/   # Register, login, JWT, current user
│   │   ├── profiles/   # Profile (self / others)
│   │   └── matches/    # Discover, like, match list
│   ├── project/        # Django settings and root URLs
│   ├── manage.py
│   └── requirements.txt
├── frontend/         # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── api/        # API clients (auth, profile, discover, likes, matches)
│   │   ├── components/ # Shared components (e.g. ProtectedRoute)
│   │   ├── contexts/   # AuthContext (login state)
│   │   └── pages/      # Page components
│   └── package.json
└── start_all.sh      # One-command start for backend + frontend
```

### Tech Stack

| Layer | Stack |
|-------|--------|
| Backend | Django 4.2, Django REST Framework, Simple JWT, django-cors-headers, SQLite |
| Frontend | React, Vite, TypeScript, React Router, Axios, Tailwind CSS, Lucide React |
| Auth | **Email**-based login, JWT (Access + Refresh Token) |

### API Endpoints

| Path | Description |
|------|-------------|
| `POST /api/auth/register/` | Register |
| `POST /api/auth/login/` | Login (returns JWT) |
| `POST /api/auth/token/refresh/` | Refresh access token |
| `GET /api/auth/me/` | Current user (auth required) |
| `GET/PUT /api/profile/me/` | My profile (auth required) |
| `GET /api/profile/<user_id>/` | Other user's profile (auth required) |
| `GET /api/discover/` | Discover users list (auth required) |
| `POST /api/likes/` | Send a like (auth required) |
| `GET /api/matches/` | Match list (auth required) |

---

## How to Run

### Prerequisites

- **Backend**: Python 3, pip
- **Frontend**: Node.js, npm (or nvm / fnm)

### 1. One-command start (recommended)

From the project root:

```bash
./start_all.sh
```

This starts:

- **Backend** at `http://localhost:8000` (creates venv if needed, installs deps, runs migrations, then runserver)
- **Frontend** at `http://localhost:5173` (runs npm install, then Vite dev server)

Use `Ctrl+C` to stop both.

### 2. Start backend and frontend separately

**Backend:**

```bash
cd backend
./start_backend.sh
```

- Creates `.venv` and installs `requirements.txt`, runs migrations if needed.
- Exits with a message if port 8000 is already in use.

**Frontend:**

```bash
cd frontend
./start_frontend.sh
```

- Runs `npm install` and `npm run dev` (supports nvm/fnm).

### 3. Frontend pages and flow

1. **Home** `/` — Redirects to login or register.
2. **Register** `/register` — Email, password, etc. → after success you can log in.
3. **Login** `/login` — Email + password → JWT; then you can access protected pages.
4. **My profile** `/profile` — View/edit your profile (auth required).
5. **User profile** `/profile/:userId` — View another user's profile (auth required).
6. **Discover** `/discover` — Browse recommended users and send likes (auth required).
7. **Matches** `/matches` — List of mutual likes (auth required).

Visiting a protected page while logged out redirects to the login page.

### 4. Optional: API base URL

The frontend defaults to `http://localhost:8000/api`. To use another URL, set:

```bash
# Example
export VITE_API_BASE_URL=http://localhost:8000/api
```

Then restart the frontend dev server.

---

## Database

- **SQLite** is used in development; database file: `backend/db.sqlite3`.
- Admin: `http://localhost:8000/admin/` (create a superuser first: `cd backend && source .venv/bin/activate && python manage.py createsuperuser`).

---

## Quick summary

1. Run `./start_all.sh` to start backend and frontend.
2. Open `http://localhost:5173` in your browser.
3. Register or log in, then edit your profile, discover users, send likes, and view matches.
