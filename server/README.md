# Server for my-project

This small Express server provides simple API endpoints backed by MongoDB (via Mongoose) for storing profile visits and contact messages.

Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI`.
2. Install deps:

```bash
cd server
npm install
```

3. Run server:

```bash
npm run dev
```

API

- `GET /api/profile` — returns profile doc (contains `visits`).
- `POST /api/profile/visit` — increments visits and returns `{ visits }`.
- `GET /api/messages` — returns recent messages.
- `POST /api/messages` — create message: `{ name, email, message }`.
