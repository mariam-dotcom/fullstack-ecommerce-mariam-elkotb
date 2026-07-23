# Nimbus — Full-Stack E-Commerce

A small storefront app built with React, Node/Express, PostgreSQL, and MongoDB.

> For plain-text setup instructions (matching the course submission format), see [`README.txt`](./README.txt).

## Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), React Router, Axios, Context API, TanStack React Query, Tailwind CSS |
| Backend | Node.js, Express (controller → service → Prisma) |
| Relational DB | PostgreSQL via Prisma ORM |
| NoSQL DB | MongoDB via Mongoose, with automatic Postgres fallback |
| Email | Nodemailer (Ethereal preview in dev) |
| Tests | Jest + Supertest (backend), Vitest + React Testing Library + MSW (frontend) |
| Containerization | Docker, Docker Compose |

## Quick start (Docker)

```bash
docker compose up --build
```

This automatically runs migrations, seeds demo data, and starts everything.

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Manager (admin dashboard) | `manager@nimbus.shop` | `manager123` |
| Shopper | `shopper@nimbus.shop` | `shopper123` |

## Features

- JWT authentication with role-based access control (Shopper / Manager)
- Product catalog with search, filtering, sorting, and pagination
- Shopping basket (add, update quantity, remove)
- Product ratings (Mongo-backed, with Postgres fallback)
- Manager dashboard: store stats, item creation with image upload, catalog management
- Automatic activity logging and welcome emails on signup

## Running tests

```bash
cd backend && npm test
cd frontend && npm test
```

## Full setup instructions

See [`README.txt`](./README.txt) for the complete setup guide, including running without Docker.