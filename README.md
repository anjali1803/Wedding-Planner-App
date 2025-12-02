# Wedding Planner Web Application

A comprehensive wedding planning platform built with React, Node.js, Express, and PostgreSQL.

## Features

- 🔐 User Authentication (JWT-based)
- 💍 Wedding Profile Management
- 👥 Guest Management with RSVP & Seating
- 🏢 Vendor Booking System
- 💰 Budget Planner with Real-time Tracking
- 📅 Wedding Timeline & Event Scheduler
- ✅ Task Checklist System
- 👑 Admin Dashboard

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Axios
- Context API for state management

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

## Project Structure

```
wedding-planner-app/
├── backend/                 # Node.js/Express API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
├── frontend/               # React application
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # React components
│       ├── pages/         # Page components
│       ├── context/       # Context providers
│       ├── services/      # API services
│       ├── utils/         # Helper functions
│       └── App.js         # Main component
└── database/              # Database schema & migrations
```

## Getting Started

See `DEVELOPMENT_GUIDE.md` for detailed setup instructions.



