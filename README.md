# Connectly CRM

A MERN-stack Customer Relationship Management application.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected customer endpoints
- Create, read, update and delete customers
- Customer search and status management
- Per-user customer ownership
- Responsive React interface

## Project structure

```text
connectly-crm/
├── client/                 # React + Vite frontend
│   ├── src/
│   ├── .env.example
│   └── vercel.json
├── server/                 # Express + MongoDB backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── .env.example
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas database (or local MongoDB)

## Run locally

### 1. Backend environment

Copy `server/.env.example` to `server/.env` and enter your own values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_at_least_32_characters_long
```

Keep `.env` private. Never commit it to GitHub.

### 2. Install and run the backend

```bash
cd server
npm install
npm run dev
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health` for service and database status.

### 3. Frontend environment

Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Install and run the frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

## API endpoints

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| POST | `/api/auth/register` | Register an account | No |
| POST | `/api/auth/login` | Sign in | No |
| GET | `/api/auth/me` | Get current user | Bearer token |
| POST | `/api/customers` | Create customer | Bearer token |
| GET | `/api/customers` | List current user's customers | Bearer token |
| PUT | `/api/customers/:id` | Update a customer | Bearer token |
| DELETE | `/api/customers/:id` | Delete a customer | Bearer token |

## Deploy backend to Render

Create a **Web Service** connected to this repository:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

Add these environment variables in Render (Settings / Environment):

- `MONGO_URI`: your MongoDB Atlas connection string
- `JWT_SECRET`: a private random string of at least 32 characters

Do not set `PORT` manually on Render; Render provides it.

For MongoDB Atlas, ensure the database user credentials are valid and the Atlas Network Access rules allow the Render service to connect. Use the narrowest network access rule practical for your deployment.

After deployment, test:
`https://YOUR-RENDER-SERVICE.onrender.com/api/health`

The response should show `"status":"ok"` and `"database":"connected"`.

## Deploy frontend to Vercel

Import the same GitHub repository as a separate Vercel project:

- Root Directory: `client`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Add this Vercel environment variable for Production (and Preview if needed):

- `VITE_API_URL`: `https://YOUR-RENDER-SERVICE.onrender.com/api`

Redeploy after changing environment variables. The `client/vercel.json` rewrite supports React Router routes on refresh.

## Environment variable reminders

- Local backend secrets belong in `server/.env`.
- Local frontend API URL belongs in `client/.env`.
- Production backend variables belong in Render's Environment settings.
- Production frontend `VITE_API_URL` belongs in Vercel's Environment Variables.
- Never upload real `.env` files or secrets to GitHub or share them in a ZIP.
