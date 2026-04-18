# Linces'CKF – Luxury Silk E-Commerce

A full-stack e-commerce application for luxury silk garments built with React (Vite) frontend and Node.js/Express/MySQL backend.

## 🏗️ Tech Stack

### Frontend
- React 19 + Vite 8
- TailwindCSS 4
- React Router DOM 7
- Socket.IO Client (real-time chat)

### Backend
- Node.js + Express
- MySQL (mysql2)
- JWT Authentication (jsonwebtoken + bcryptjs)
- Socket.IO (real-time chat)
- MVC Architecture

## 📋 Prerequisites

- Node.js (v18+)
- MySQL Server
- npm

## 🗄️ Database Setup

1. Start your MySQL server
2. Run the schema file to create the database, tables, and seed data:

```bash
mysql -u root -p < backend/schema.sql
```

Or open MySQL Workbench and execute the contents of `backend/schema.sql`.

3. Backend environment: copy `backend/.env.example` to `backend/.env` and set your MySQL password and a strong `JWT_SECRET` (the real `.env` is not committed to git).

This will create:
- Database: `lincesckf_db`
- 10 tables with proper primary/foreign keys
- Seed data: 4 categories, 8 products, 24 reviews, 1 demo user

## 🚀 Running the Application

### One command on your PC (recommended)

From the **project root** (after [Database Setup](#-database-setup)):

```bash
npm install
cd backend && npm install && cd ..
```

The repo includes an `.npmrc` so `npm install` tolerates the current Vite / Tailwind peer range. If you remove it and see peer errors, use `npm install --legacy-peer-deps`.

**Development** — API + Vite together (hot reload):

```bash
npm run dev:all
```

- **App:** [http://localhost:5173](http://localhost:5173)
- **API & chat:** port from `backend/.env` (default **5001**)

**Production-style local** — build the React app, then run the API plus Vite preview (good sanity check before hosting):

```bash
npm run start:local
```

- **App:** [http://127.0.0.1:4173](http://127.0.0.1:4173)
- **API & chat:** same as above (`http://localhost:5001` by default)

Stop either command with `Ctrl+C` (both processes exit together).

`dev:all` runs the API **without** `node --watch` so two file watchers do not overload your system. Restart that process after you change server code, or use two terminals with `npm run dev` in `backend/` and `npm run dev` at the root if you want watch mode on both.

### Backend (manual, separate terminal)

```bash
cd backend
npm install
npm run dev
```

The backend URL is `http://localhost:<PORT>` where `PORT` comes from `backend/.env` (this repo uses **5001** by default).

### Frontend (manual, separate terminal)

```bash
# From the root project directory
npm install
npm run dev
```

The dev server listens on [http://localhost:5173](http://localhost:5173).

### Frontend API URL (production / cloud)

The React app calls the API at `http://localhost:5001` by default. For deployment, set in the **frontend** project root (e.g. `.env.production`):

```bash
VITE_API_ORIGIN=https://your-api-host.example.com
```

(No trailing slash.) Real-time chat uses the same origin via Socket.IO.

## 🔐 Login Credentials

| Account | Email | Password |
|---------|-------|----------|
| Demo User | demo@lincesckf.com | password123 |

Or register a new account through the app.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login

### Homepage
- `GET /api/home` — Featured products, categories, recommended

### Products
- `GET /api/products` — List (supports `?category=`, `?sort=`, `?search=`, `?page=`, `?limit=`)
- `GET /api/products/:id` — Detail with reviews and related products

### Cart (Auth Required)
- `GET /api/cart` — Get cart
- `POST /api/cart/add` — Add item
- `PUT /api/cart/update` — Update quantity
- `DELETE /api/cart/remove` — Remove item

### Orders (Auth Required)
- `GET /api/orders` — Order history
- `POST /api/orders` — Place order

### User Account (Auth Required)
- `PUT /api/user/update` — Update profile
- `PUT /api/user/password` — Change password
- `GET /api/user/preferences` — Get preferences
- `PUT /api/user/preferences` — Update preferences

### Contact
- `POST /api/contact` — Submit contact/custom order form

### Reviews (Auth Required)
- `POST /api/reviews` — Add product review

### Chat
- Socket.IO on the same host/port as the API (see `VITE_API_ORIGIN` / default `http://localhost:5001`)

## 📁 Project Structure

```
lincesckf/
├── src/                  # React Frontend
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers (Auth, Cart, Order, Language)
│   ├── pages/            # Page components
│   ├── utils/            # API helper, validation
│   └── i18n/             # Translations (English/Spanish)
├── backend/              # Node.js Backend
│   ├── config/           # Database connection
│   ├── middleware/        # JWT authentication
│   ├── models/           # Database models (SQL queries)
│   ├── controllers/      # Request handlers
│   ├── routes/           # Express route definitions
│   ├── sockets/          # Socket.IO chat handler
│   ├── schema.sql        # Database DDL + seed data
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
├── public/               # Static assets
└── package.json          # Frontend dependencies
```

## ✅ Features

- **Dynamic Data**: All data fetched from MySQL (no hardcoding)
- **Authentication**: JWT-based login/register
- **Product Catalog**: Filtering, sorting, search, pagination
- **Shopping Cart**: Add, update, remove items with backend persistence
- **Order System**: Place orders with shipping info
- **Contact Form**: Stored in database
- **Account settings**: Profile, password, email/SMS notification preferences (`/settings`)
- **Real-time Chat**: Socket.IO with message persistence
- **Bilingual**: English/Spanish support
- **Responsive**: Mobile-first design
