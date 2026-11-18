# QuizFlow

QuizFlow is a premium full-stack quiz application built with React, Vite, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB. It includes authentication, a quiz-taking flow, result analysis, admin quiz management, protected routes, and seeded sample data for immediate testing.

## Features

- Premium dashboard and responsive user interface
- User registration and login with secure HTTP-only cookies
- Protected routes and admin-only quiz management
- Quiz search, category, and difficulty filters
- Timed multiple-choice exams with progress tracking
- Server-side scoring and result review
- MongoDB-backed persistence for quizzes and attempt history
- Realistic seeded quiz data and admin controls

## Tech Stack

### Frontend

- React + Vite + TypeScript
- Tailwind CSS
- React Router
- Axios
- Lucide React
- React Hot Toast

### Backend

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Zod validation
- JWT-based authentication
- Helmet, CORS, rate limiting

## Project Structure

```text
MINI PROJECT/
├── client/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
├── server/
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── package.json
├── README.md
├── .gitignore
└── .env.example (optional root-level example)
```

## Quick Start

1. Open a terminal in the project root:

```bash
cd "C:/AWT/MINI PROJECT"
```

2. Install dependencies:

```bash
npm install
```

3. Create environment files:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

4. Set `MONGODB_URI` in `server/.env` to your MongoDB Atlas connection string (or a local MongoDB URI).

5. Start both apps in development mode:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

The backend API will run at:

```text
http://localhost:5000
```

## Environment Variables

### Client

```env
VITE_API_URL=http://localhost:5000/api
```

For Vercel deployments, set `VITE_API_URL` to the backend origin (for example,
`https://your-api.onrender.com`) or its `/api` URL. The client adds `/api` when
it is missing. Redeploy the frontend after changing this build-time variable.

### Server

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/quiz_app
JWT_SECRET=change_this_to_a_secure_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## MongoDB Setup

### Local MongoDB

1. Install MongoDB Community Edition.
2. Start the MongoDB service.
3. Keep the default URI or change it in the server `.env` file.

### MongoDB Atlas

1. Create a cluster.
2. Create a database user.
3. In Atlas Network Access, allow the IP address from which the server will connect.
4. Copy the cluster connection string into `server/.env` as `MONGODB_URI`; replace the username, password, and cluster host placeholders, and use `quiz_app` as the database name.
5. Restart the server. It connects through Mongoose before accepting requests and seeds sample quizzes when needed.

Keep the real connection string in `server/.env` only. Do not commit credentials or share the URI.

The application automatically seeds an initial set of quizzes if the database is empty.

## Default Admin User

For admin access, create a user in the database or register through the app and update the role to `admin` manually.

Example:

```js
{ role: 'admin' }
```

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

### Quizzes

```http
GET /api/quizzes
GET /api/quizzes/:id
POST /api/quizzes
PUT /api/quizzes/:id
DELETE /api/quizzes/:id
POST /api/quizzes/:id/submit
```

### Attempts and Dashboard

```http
GET /api/attempts
GET /api/attempts/:id
GET /api/dashboard/stats
```

## Example Requests

### Register user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Aisha","email":"aisha@example.com","password":"password123"}'
```

### Login user

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aisha@example.com","password":"password123"}'
```

### Submit quiz

```bash
curl -X POST http://localhost:5000/api/quizzes/<quizId>/submit \
  -H "Content-Type: application/json" \
  -b "cookie=value" \
  -d '{"answers":{"q1":"A","q2":"B"},"timeSpentSeconds":120}'
```

## Testing

Run backend tests:

```bash
cd "C:/AWT/MINI PROJECT"
npm run test --workspace server
```

Run production build:

```bash
cd "C:/AWT/MINI PROJECT"
npm run build
```

## Screenshots

![Dashboard view](docs/dashboard.png)
![Quiz experience](docs/quiz.png)
![Results view](docs/results.png)

## Final Verification Checklist

- [x] User registration works
- [x] User login and logout work
- [x] Protected routes enforce authentication
- [x] Quiz search and filter work
- [x] Timed quiz flow works
- [x] Submission is scored on the backend
- [x] Results and history persist to MongoDB
- [x] Admin CRUD works for quizzes
- [x] Sample data is available for quick testing
- [x] TypeScript build passes
- [x] Backend tests pass

## Notes

This project is intentionally designed to be ready for local development and demonstration. For production deployment, use a secure secret manager, add HTTPS, configure a managed MongoDB instance, and tighten cookie settings for your hosting platform.
