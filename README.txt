Nimbus - Full-Stack E-Commerce Project
======================================

Repository: https://github.com/mariam-dotcom/fullstack-ecommerce-mariam-elkotb

Nimbus is a small storefront app: React frontend, Node/Express backend
(service-layer architecture), PostgreSQL via Prisma for core data, and
MongoDB for ratings/activity logs (with automatic Postgres fallback if
Mongo is offline).

1. TECHNOLOGIES USED
---------------------
* Frontend: React (Vite), React Router, Axios, Context API, TanStack React Query, Tailwind CSS.
* Backend: Node.js, Express (controller -> service -> Prisma layering).
* Relational DB: PostgreSQL (Prisma ORM).
* NoSQL DB: MongoDB (Mongoose), with automatic relational fallback.
* Email: Nodemailer (Ethereal test account if no SMTP configured).
* Tests: Jest + Supertest (backend), Vitest + React Testing Library + MSW (frontend).
* Containerization: Docker, Docker Compose.

2. FOLDER STRUCTURE
--------------------
* /backend  - Express API, Prisma schema, Mongoose models, Jest tests.
  - backend/Dockerfile builds the backend service image (Node 20 Alpine,
    installs deps, generates the Prisma client).
* /frontend - React Vite app, Tailwind styles, Vitest tests.
  - frontend/Dockerfile builds the frontend service image (Node 20 Alpine,
    runs the Vite dev server on container start).
* docker-compose.yml - orchestrates both Dockerfiles above plus Postgres
  and MongoDB into one stack, so all four services start together.

3. PROJECT URLS
-----------------
* Frontend:     http://localhost:5173
* Backend:      http://localhost:5000
* Health Check: http://localhost:5000/api/health

4. CORE FEATURES
------------------
* JWT authentication with role-based access control (Shopper / Manager).
* Product catalog: search, category filtering, sorting, and pagination.
* Product detail pages with full data and image display.
* Quick "Add to basket" directly from product cards, plus full basket
  management (add, update quantity, remove).
* Simulated checkout flow (order summary -> place order -> confirmation
  with a generated order number; no real payment is processed).
* Image upload for products (Multer, manager-only).
* Product ratings/reviews (Mongo-backed, Postgres fallback).
* User profile page: view and update your own account information.
* Manager dashboard: aggregated store stats, category creation/deletion,
  item creation, item editing, and catalog management.
* Welcome email on registration (Nodemailer).
* Activity logging for key account actions.

5. HOW TO RUN WITH DOCKER (recommended - matches submission environment)
---------------------------------------------------------------------------
   docker compose up --build

   This builds both backend/Dockerfile and frontend/Dockerfile, starts
   Postgres and MongoDB, and on first run automatically:
     - waits for Postgres to be ready
     - applies Prisma migrations
     - seeds demo accounts, collections, and items
     - starts the backend and frontend

   See section 3 above for the URLs this exposes.

   To stop: docker compose down
   (data persists in named Docker volumes between runs)

6. HOW TO RUN LOCALLY (without Docker)
---------------------------------------
A. Copy environment files:
   backend:  copy .env.example to .env   (Windows: Copy-Item .env.example .env)
   frontend: copy .env.example to .env
   Edit backend/.env if your local Postgres/Mongo credentials differ.

B. Backend:
   cd backend
   npm install
   npx prisma migrate dev --name init
   npm run seed
   npm run dev
   -> http://localhost:5000

C. Frontend (new terminal):
   cd frontend
   npm install
   npm run dev
   -> http://localhost:5173

7. SEEDED TEST ACCOUNTS
------------------------
* Shopper: shopper@nimbus.shop / shopper123
* Manager (admin dashboard access): manager@nimbus.shop / manager123

8. RUNNING TESTS
-----------------
Backend:  cd backend && npm test
Frontend: cd frontend && npm test

9. ENVIRONMENT VARIABLES
--------------------------
backend/.env.example:
* PORT           - port the API listens on (default 5000).
* DATABASE_URL   - PostgreSQL connection string used by Prisma.
* MONGO_URI      - MongoDB connection string for ratings/activity logs.
* JWT_SECRET     - secret used to sign/verify auth tokens (set to any
                    long random string for local use).
* JWT_EXPIRES_IN - how long issued tokens stay valid (e.g. 7d).
* SMTP_HOST/PORT/USER/PASS - optional; leave blank to auto-use an
  Ethereal test inbox for welcome emails instead of a real mail server.

frontend/.env.example:
* VITE_API_URL   - base URL the frontend calls for the API
                    (default http://localhost:5000/api).

10. KEY ASSUMPTIONS
--------------------
* Node.js v20+ recommended locally (matches the Node 20 Alpine base
  image used by both Dockerfiles; v18 likely works too but is untested
  here).
* If MongoDB is offline, ratings and activity logs fall back to PostgreSQL
  and the console, respectively - the app does not crash.
* Welcome emails route through Ethereal test SMTP by default and print a
  clickable preview link to the backend console.
* JWT_SECRET differs between the local .env and docker-compose.yml by
  design (separate environments); signing in again after switching
  between local and Docker runs is expected.
* Seeded product images are hotlinked from Unsplash, so an internet
  connection is needed to see them load; images uploaded through the
  admin dashboard are stored locally and do not need internet access.
* Checkout is simulated for demonstration purposes only - no payment
  gateway is integrated and no real charge occurs.
