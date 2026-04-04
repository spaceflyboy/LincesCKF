# Linces'CKF E-Commerce Platform — Phase 2 Deliverable

**Course:** CSE 5335 | Spring 2026  
**Phase:** 2 (Front-end Architecture & Client-Side Application)  
**Live Deployment:** [https://dbh1132.uta.cloud/](https://dbh1132.uta.cloud/)

Welcome to the Phase 2 deliverable for the Linces'CKF E-Commerce Platform. This repository contains the complete, deployable front-end application. It has been designed to meet and exceed all Phase 2 requirements, establishing a clean, modular interface architecture prior to backend integration in Phase 3.

## 🎯 Key Achievements & Features

- **Comprehensive UI Implementation:** Successfully engineered 11 fully responsive pages and 7 modular UI components leveraging React 19 and Vite.
- **Responsive & Modern Design:** Developed using a mobile-first approach with Tailwind CSS. The application provides seamless, aesthetic layouts across mobile, tablet, and widescreen desktop viewports.
- **Robust Client-Side Functionality:** Employs advanced state management using the React Context API. The application flawlessly persists shopping cart data and simulated user authentication sessions via browser `localStorage`.
- **Form Validation & UX:** Incorporates strict client-side validation logic across all contact and order forms, offering instant user feedback.
- **Internationalization (i18n):** Features a fully functional language switcher, seamlessly toggling the entire interface between English and Spanish.

## 🏗 Project Architecture

```text
phase2/
├── public/                 # Static assets (images, icons, visuals)
├── src/
│   ├── components/         # Reusable UI elements (Navigation, Cards, Forms, Modals)
│   ├── context/            # React Context Providers (Auth, Cart, Order, Language)
│   ├── data/               # Static product mock data (until Phase 3 backend integration)
│   ├── i18n/               # Bilingual translation dictionaries
│   ├── pages/              # Primary application views (11 distinct pages)
│   ├── utils/              # Development helper functions and validation logic
│   ├── App.jsx             # Main application router and state wrapper
│   ├── main.jsx            # Primary React entry point
│   └── index.css           # Global base styles, themes, and Tailwind configuration
├── index.html              # Core HTML template
├── package.json            # Project dependencies and operational scripts
├── eslint.config.js        # Linter rules and code quality configuration
└── vite.config.js          # Build tool configuration (Vite)
```

## 🚀 Getting Started

To run the application locally, please ensure that you have **Node.js (v18 or higher)** installed on your system.

1. **Install Dependencies:**
   Navigate into the `phase2` directory and install the required modules:
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   Launch the high-performance local server:
   ```bash
   npm run dev
   ```

3. **View the Application:**
   Open your preferred web browser and navigate to `http://localhost:5173`.

*Note: As this is the Phase 2 (Front-end) deliverable, all application data is currently managed statically on the client. Live database and backend REST API integrations will be formalized in Phase 3.*
