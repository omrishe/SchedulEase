# SchedulEase

A full-stack appointment management system built for small-businesses (barbers, nail salons, etc) where clients can book appointments through a Frontend web interface  
allows store owners to manage thier store services,availability,announcement and more through an easy to use interface .

---

## Purpose & Goals

The goal of SchedulEase is to provide a simple, scalable, and extendable appointment-booking system aimed at small businesses (for example barbershops, nail salons, small clinics) that:

- allows clients to pick available time slots
- allows business owners/staff to view, add, edit, cancel appointments
- uses token-based frontend authentication and store info
- uses a modern frontend (React) and backend (Node.js + database) so it can be extended/maintained
- integrates easily with external services if needed (e.g., email reminders, calendar sync)

---

## Features

### Client-facing React interface to:

- browse available services/time slots
- book an appointment (enter name, email, service type, notes)

### Business-side API to:

- store client bookings
- allow business to view upcoming appointments
- allow business to edit or cancel appointments

### Additional System Features:

- Authentication layer: clients supply email and token to verify (or business staff login)
- Data persistence using a database (MongoDB) to store appointments, clients, service definitions
- Modular backend (Node.js) + frontend (React) separation
- Designed for extension

---

## Technology Stack

Here’s a breakdown of main technologies used in this system:

### Frontend:

- React and JavaScript
- Hooks for state management
- Communication with backend API - REST

### Backend:

- Node.js - serverless configurations
- Express.JS for HTTP API endpoints
- Authentication middleware (JWTs and token-based)

### Database:

- MongoDB
- Stores collections such as users, appointments, services

### Authentication/Security:

- JSON Web Tokens (JWTs) for verifying client email/token interactions
- HTTPs-only cookies for token transport

### Hosting / Infra:

- Can integrate with AWS (currently deployed on AWS Lambda + S3 + CloudFront)
- Frontend static hosting (currently deployed S3 + CloudFront)

### Miscellaneous:

- Logging/monitoring: errors are displayed in a pattern and only relevent error data returned to frontend (for security) while full error can be viewed at backend

---

## Getting Started / Installation

Here’s how to get a working local version running. You can adapt for staging/production as needed.

### Prerequisites

- Node.js (v16 + recommended)
- npm or yarn
- MongoDB instance (local or remote)
- (Optional) `.env` file with config values

---

### Steps

#### 1.Clone the repository:

```bash
git clone https://github.com/omrishe/SchedulEase.git
cd SchedulEase
```

#### 2.Set up backend

```bash
cd server
npm install
```

#### 3.Create a file **`.env`** in the `server` folder with at least:

```
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

#### 4.Run the backend:

```bash
npm run dev
```
