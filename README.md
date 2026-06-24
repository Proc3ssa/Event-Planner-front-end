# Eventify — Event Management System

A full-stack web application for creating and managing events, sending digital invitations, and handling attendee check-ins via digital tickets. Built as a final year project.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)

---

## Overview

Eventify is a role-based event management portal that allows event organizers to create events, manage staff, send personalized digital invitations with one-time-use links, and track attendance. Receptionists can scan digital tickets at the venue entrance to verify attendees.

---

## Features

### Organizer
- Create, edit, and delete events with flyer upload
- Generate one-time-use invitation links per attendee
- Send invitation links via email or SMS
- Manage attendees — assign table numbers, mark present/absent
- Add and manage organizer and receptionist accounts
- Soft deactivate/reactivate staff accounts

### Receptionist
- Log in and scan digital tickets at event entrance

### Attendee (no login required)
- Receive invitation link via email or SMS
- Accept or decline invitation via a public page
- Link expires after one use

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Authentication | JWT (JSON Web Tokens) |
| File Uploads | Multer |
| Password Hashing | bcryptjs |
| HTTP Client | Axios |
| Routing | React Router DOM |
| Icons | Tabler Icons |

---

## Project Structure

```
eventify-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/          # ConfirmModal, etc.
│   │   ├── events/          # EditEventModal, etc.
│   │   ├── layout/          # Navbar, Footer, DashboardLayout
│   │   └── users/           # UserListPage
│   ├── pages/
│   │   ├── auth/            # Login
│   │   ├── dashboard/       # ReceptionistDashboard
│   │   ├── events/          # EventsHome, NewEvent, EventDetails
│   │   ├── invite/          # InvitePage
│   │   └── users/           # AddUser, OrganizersList, ReceptionistsList
│   ├── routes/              # AppRouter, PrivateRoute
│   ├── services/            # api.js, authService, eventService, etc.
│   └── main.jsx
├── .env
└── package.json

eventify-backend/
├── src/
│   ├── config/              # db.js
│   ├── controllers/         # auth, event, user, invitation
│   ├── middleware/          # auth.middleware.js
│   ├── models/              # user, event, invitation
│   └── routes/              # auth, event, user, invitation
├── uploads/                 # Uploaded event flyers
├── server.js
├── .env
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MySQL 8+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/your-username/eventify.git
```

### 2. Set up the backend

```bash
cd eventify-backend
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables)), then:

```bash
mkdir uploads
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Set up the frontend

```bash
cd eventify-frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Environment Variables

### Backend `.env`

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=eventify
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## Database Setup

Run the following SQL in your MySQL client:

```sql
CREATE DATABASE eventify;
USE eventify;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('organizer', 'receptionist') NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  venue VARCHAR(200) NOT NULL,
  flyer VARCHAR(255),
  organizer_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id)
);

CREATE TABLE invitations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  recipient_name VARCHAR(100),
  recipient_contact VARCHAR(100),
  contact_type ENUM('email', 'sms') DEFAULT 'email',
  status ENUM('pending', 'accepted', 'declined', 'used') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB;
```

To create a test organizer account, hash a password first:

```bash
node src/utils/hashPassword.js yourpassword123
```

Then insert:

```sql
INSERT INTO users (name, email, password_hash, role)
VALUES ('Your Name', 'organizer@eventify.com', '<hashed_password>', 'organizer');
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login and receive JWT |

### Events
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/events` | Organizer | List all events |
| POST | `/api/events` | Organizer | Create a new event |
| GET | `/api/events/:id` | Organizer | Get single event |
| PUT | `/api/events/:id` | Organizer | Update event |
| DELETE | `/api/events/:id` | Organizer | Delete event |

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/users` | Organizer | Add organizer or receptionist |
| GET | `/api/users/:role` | Organizer | List users by role |
| PATCH | `/api/users/:id/status` | Organizer | Activate or deactivate user |

### Invitations
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/invitations` | Organizer | Generate invitation link |
| GET | `/api/invitations/:token` | Public | Get invitation details |
| PATCH | `/api/invitations/:token/respond` | Public | Accept or decline invitation |

---

## User Roles

| Role | Access |
|---|---|
| **Organizer** | Full access — create events, manage staff, send invitations, manage attendees |
| **Receptionist** | Scan digital tickets at event entrance |
| **Attendee** | No login — receives invitation link, accepts or declines |

> At least one active organizer must always exist in the system. The last active organizer cannot be deactivated.

---

## Screenshots

<img width="1275" height="678" alt="brave_screenshot_localhost (1)" src="https://github.com/user-attachments/assets/3c8024b4-4e65-4b0c-ac28-583b90f748e8" />


---

## License

This project was developed as a final year academic project.
