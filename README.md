this system code was 90% written by hand, if you find any issues kindly post them in issues

# SchedulEase

**SchedulEase** is a full-stack appointment scheduling platform designed for small businesses such as barbershops, nail salons, and clinics. It enables customers to easily book appointments online while giving business owners full control over services, availability, and bookings through a clean management interface.

---

## 🚀 Overview

SchedulEase provides a scalable foundation for appointment-based businesses, focusing on simplicity, extensibility, and clean separation between client and business workflows.

It supports:

- Customer booking flow via a web interface
- Business management of appointments, services, and availability
- Secure authentication and session handling
- Cloud ready, serverless compatible architecture

---

## 🎯 Goals

- Provide an intuitive booking experience for customers
- Give business owners full control over scheduling and services
- Maintain a modular and extensible architecture
- Support integration with external tools (email, calendar, etc.)
- Be production ready and cloud deployable

---

## ✨ Features

### 👤 Customer Features

- Browse available services
- View real time available time slots
- Book appointments with details (name, email, notes)
- Receive booking confirmation

### 🧑‍💼 Business Features

- View upcoming appointments
- Add, edit, and cancel appointments
- Manage services (create, update, delete)
- Configure availability and time slots

### 🔐 System Features

- JWT based authentication
- HTTP only secure cookies
- Role based access control (user / admin)
- Centralized and sanitized error handling with machine readable error codes

---

## 🧱 Architecture

SchedulEase follows a separated frontend/backend architecture:

- **Frontend:** React SPA
- **Backend:** Node.js (Express, serverless compatible via AWS SAM)
- **Database:** MongoDB
- **Deployment:** AWS (Lambda, S3, CloudFront)

### Flow

```
Client (React) → REST API (Express) → Auth Layer (JWT/Cookies) → MongoDB
```

---

## 🛠 Tech Stack

### Frontend

- React (Hooks based)
- JavaScript (ES6+)
- Vite (dev server)
- REST API communication

### Backend

- Node.js
- Express.js
- Serverless ready (AWS Lambda compatible via `@vendia/serverless-express`)

### Database

- MongoDB + Mongoose (users, appointments, services, time slots)

### Authentication & Security

- JSON Web Tokens (JWT)
- HTTP only cookies
- CORS protection via `ALLOWED_ORIGINS`
- Sanitized API responses with structured error codes

### Infrastructure

- AWS Lambda (backend)
- AWS SAM CLI (local development)
- AWS S3 (frontend hosting)
- CloudFront (CDN)
- AWS SSM Parameter Store (secrets management)

---

## 📁 Project Structure

```
SchedulEase/
├── frontend/                  # React SPA (Vite)
│   └── src/
│       ├── api/               # API request helpers
│       ├── components/        # Reusable UI components
│       ├── hooks/             # Custom React hooks
│       ├── pages/             # Page level components
│       ├── services/          # Business logic / data services
│       ├── utils/             # Shared utilities
│       └── config.js          # Frontend constants & validation limits
└── server/                    # AWS Lambda / Express backend
    ├── Models/                # Mongoose schemas
    ├── routes/                # Express route handlers
    ├── middlewares/           # Auth & role middleware
    ├── utils/                 # Response handlers, date utilities
    ├── database/              # DB connection & seed script
    ├── config.js              # Server side constants & validation limits
    └── template.yaml          # AWS SAM template
```

---

## 📦 Installation

### Prerequisites

- [Node.js v18+](https://nodejs.org/)
- npm or yarn
- [MongoDB](https://www.mongodb.com/) (local or Atlas cloud)
- [Docker Desktop v4+](https://docs.docker.com/get-docker/) – required by AWS SAM for local emulation
- [AWS SAM CLI v1.100+](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) – required to run the backend locally

---

### Steps

#### 1. Clone the repository

```bash
git clone https://github.com/omrishe/SchedulEase.git
cd SchedulEase
```

#### 2. Set up the backend

```bash
cd server
npm install
```

#### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable               | Description                                  |
| ---------------------- | -------------------------------------------- |
| `MONGO_URI`            | MongoDB connection string (e.g. Atlas URI)   |
| `SECRET_HASH_PASSWORD` | Secret key used for JWT signing              |
| `ALLOWED_ORIGINS`      | Comma separated list of allowed CORS origins |

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
SECRET_HASH_PASSWORD=your_secret_here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
```

> **Note:** In production, secrets (`MONGO_URI`, `SECRET_HASH_PASSWORD`) are loaded from **AWS SSM Parameter Store** — the `.env` file is only used for local development.

#### 4. (Optional) Seed the database

To populate the database with sample data:

```bash
npm run seed
```

#### 5. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

#### 6. Verify AWS SAM is installed

AWS SAM CLI is required to run the backend locally.

```bash
sam --version
```

#### 7. Verify Docker is running

Docker is required by SAM to emulate the Lambda environment.

```bash
docker version
```

#### 8. Run the backend locally (SAM)

> ⚠️ Make sure **Docker Desktop is running** before executing this command.

```bash
cd server
npm run sam:dev
```

This runs `sam build && sam local start-api`, starting the API at `http://localhost:3000`.

---

## 🔌 API Overview

All routes are prefixed with their resource path. Authentication uses HTTP only cookies (`loginToken`).

### 🔐 Authentication (`/auth`)

| Method | Route                  | Auth Required | Description                               |
| ------ | ---------------------- | ------------- | ----------------------------------------- |
| `POST` | `/auth/signup`         | No            | Register a new user for a store           |
| `POST` | `/auth/login`          | No            | Authenticate and receive a session cookie |
| `POST` | `/auth/logout`         | No            | Clear the session cookie                  |
| `GET`  | `/auth/validate-token` | Yes           | Verify the current session token          |

### 📅 Appointments (`/appointments`)

| Method | Route                                           | Auth Required | Description                                 |
| ------ | ----------------------------------------------- | ------------- | ------------------------------------------- |
| `POST` | `/appointments/new-appointment`                 | Yes           | Book a new appointment                      |
| `GET`  | `/appointments/get-available-appointment-dates` | Yes           | Fetch available time slots for a date range |
| `GET`  | `/appointments/get-all-store-appointments`      | Admin         | Fetch all appointments for the business     |
| `GET`  | `/appointments/get-user-booking-info`           | Yes           | Fetch the logged-in user's appointments     |
| `GET`  | `/appointments/get-appointments-info`           | Admin         | Fetch all raw appointment records           |

### 🏪 Store (`/store`)

| Method   | Route                           | Auth Required | Description                                      |
| -------- | ------------------------------- | ------------- | ------------------------------------------------ |
| `GET`    | `/store/get-store-info`         | Yes           | Fetch the current user's store info              |
| `GET`    | `/store/fetch-Store-Data`       | No            | Fetch store services by `storeId` or `storeSlug` |
| `GET`    | `/store/check-slug/:slug`       | No            | Check if a store slug exists                     |
| `POST`   | `/store/new`                    | Yes           | Create a new store                               |
| `POST`   | `/store/new-store-time-slots`   | Admin         | Add available time slots                         |
| `POST`   | `/store/set-new-store-services` | Admin         | Add new services to a store                      |
| `PATCH`  | `/store/updateService`          | Admin         | Edit an existing service                         |
| `DELETE` | `/store/delete-services`        | Admin         | Delete a service from the store                  |

---

## 🔒 Security

- Authentication handled via **JWT tokens** (12-hour expiry)
- Tokens stored in **HTTP only, Secure, SameSite=None cookies** (not accessible from frontend JS)
- Protected routes validated through **JWT middleware**
- Admin only routes protected by an additional **`requireAdmin` middleware**
- **CORS restrictions** enforced via the `ALLOWED_ORIGINS` environment variable
- Error responses are **sanitized** and return machine readable **error codes** to prevent leaking sensitive backend details
- Passwords hashed with **bcrypt** (10 salt rounds)

---

## 📈 Future Improvements

- Email / SMS appointment reminders
- Google Calendar / external calendar integration
- Business analytics dashboard (revenue, bookings, trends)
- Multi location / multi branch support
- Stripe payment integration
- Role based admin hierarchy (owner / staff / admin)

---

## 🧑‍💻 Development Notes

- Backend is designed to be **serverless ready (AWS Lambda compatible)**
- Secrets in production are managed via **AWS SSM Parameter Store** — not `.env` files
- Clear separation between controllers, services, and routes
- Frontend follows a **modular React component structure**
- Both frontend and backend share validation limits via their respective `config.js` files
- API designed with **future versioning in mind (v1, v2, etc.)**

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
