# Wedding Planner Web Application - Development Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Features Overview](#features-overview)
9. [Deployment](#deployment)

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **PostgreSQL** (v13 or higher)
- **npm** or **yarn**
- **Git**

## 📁 Project Structure

```
wedding-planner-app/
├── backend/                 # Node.js/Express API
│   ├── config/
│   │   └── database.js      # Database configuration
│   ├── controllers/         # Route controllers
│   │   ├── authController.js
│   │   ├── weddingController.js
│   │   ├── guestController.js
│   │   ├── vendorController.js
│   │   ├── bookingController.js
│   │   ├── budgetController.js
│   │   ├── taskController.js
│   │   ├── timelineController.js
│   │   └── adminController.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # Authentication middleware
│   │   └── error.js         # Error handler
│   ├── models/              # Sequelize models
│   │   ├── User.js
│   │   ├── Wedding.js
│   │   ├── Guest.js
│   │   ├── Vendor.js
│   │   ├── Booking.js
│   │   ├── BudgetItem.js
│   │   ├── Task.js
│   │   ├── TimelineEvent.js
│   │   └── index.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── weddings.js
│   │   ├── guests.js
│   │   ├── vendors.js
│   │   ├── bookings.js
│   │   ├── budget.js
│   │   ├── tasks.js
│   │   ├── timeline.js
│   │   └── admin.js
│   ├── .env.example         # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js            # Entry point
│
├── frontend/                # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── PrivateRoute.js
│   │   │   └── ...
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.js
│   │   ├── pages/           # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── WeddingDetail.js
│   │   │   ├── Guests.js
│   │   │   ├── Vendors.js
│   │   │   ├── Budget.js
│   │   │   ├── Tasks.js
│   │   │   ├── Timeline.js
│   │   │   └── AdminDashboard.js
│   │   ├── services/        # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── weddingService.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .gitignore
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── database/
│   └── schema.sql           # Database schema
│
└── README.md
```

## 🗄️ Database Setup

### Step 1: Install PostgreSQL

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Run the installer and remember your password

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

1. Open PostgreSQL shell (psql):
```bash
psql -U postgres
```

2. Create the database:
```sql
CREATE DATABASE wedding_planner_db;
```

3. Connect to the database:
```sql
\c wedding_planner_db
```

4. Run the schema file:
```bash
psql -U postgres -d wedding_planner_db -f database/schema.sql
```

OR manually execute the SQL commands from `database/schema.sql`

### Step 3: Verify Tables

```sql
\dt
```

You should see all 8 tables: Users, Weddings, Guests, Vendors, Bookings, BudgetItems, Tasks, TimelineEvents

## 🔧 Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

1. Copy the example env file:
```bash
cp .env.example .env
```

2. Edit `.env` with your settings:
```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=wedding_planner_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

CLIENT_URL=http://localhost:3000
```

### Step 3: Test Database Connection

```bash
npm run dev
```

You should see:
```
✅ Database connection established successfully.
✅ Database models synchronized
🚀 Server running in development mode on port 5000
```

## ⚛️ Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Verify Configuration

The `package.json` includes a proxy to the backend:
```json
"proxy": "http://localhost:5000"
```

This allows frontend to make API calls without CORS issues during development.

### Step 3: Test Frontend

```bash
npm start
```

The app should open at `http://localhost:3000`

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

### Default Test Credentials

Create your first user by registering at http://localhost:3000/register

For admin access, update a user in the database:
```sql
UPDATE "Users" SET role = 'admin' WHERE email = 'your@email.com';
```

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Wedding Endpoints

#### Get All Weddings
```http
GET /api/weddings
Authorization: Bearer {token}
```

#### Get Single Wedding
```http
GET /api/weddings/:id
Authorization: Bearer {token}
```

#### Create Wedding
```http
POST /api/weddings
Authorization: Bearer {token}
Content-Type: application/json

{
  "brideName": "Jane Smith",
  "groomName": "John Doe",
  "weddingDate": "2025-06-15",
  "venue": "Grand Hotel",
  "venueAddress": "123 Main St, City",
  "totalBudget": 50000,
  "theme": "Rustic",
  "description": "Beautiful outdoor wedding"
}
```

#### Update Wedding
```http
PUT /api/weddings/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "venue": "Updated Venue",
  "status": "confirmed"
}
```

#### Delete Wedding
```http
DELETE /api/weddings/:id
Authorization: Bearer {token}
```

### Guest Endpoints

#### Get All Guests for Wedding
```http
GET /api/weddings/:weddingId/guests
Authorization: Bearer {token}
```

#### Create Guest
```http
POST /api/weddings/:weddingId/guests
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice@example.com",
  "phone": "+1234567890",
  "category": "friend",
  "side": "bride",
  "rsvpStatus": "pending",
  "plusOne": true,
  "tableNumber": 5
}
```

#### Update Guest
```http
PUT /api/guests/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "rsvpStatus": "accepted",
  "tableNumber": 3
}
```

#### Delete Guest
```http
DELETE /api/guests/:id
Authorization: Bearer {token}
```

### Vendor Endpoints

#### Get All Vendors
```http
GET /api/vendors?category=photographer&search=pro
Authorization: Bearer {token}
```

#### Create Vendor (Admin Only)
```http
POST /api/vendors
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Pro Photography",
  "category": "photographer",
  "email": "contact@prophotography.com",
  "phone": "+1234567890",
  "address": "456 Studio Ave",
  "website": "https://prophotography.com",
  "description": "Professional wedding photography",
  "priceRange": "$2000-$5000",
  "rating": 4.8
}
```

### Budget Endpoints

#### Get Budget Items
```http
GET /api/weddings/:weddingId/budget
Authorization: Bearer {token}
```

#### Create Budget Item
```http
POST /api/weddings/:weddingId/budget
Authorization: Bearer {token}
Content-Type: application/json

{
  "category": "Venue",
  "itemName": "Hall Rental",
  "estimatedCost": 5000,
  "actualCost": 4800,
  "isPaid": true,
  "paymentDate": "2025-01-15"
}
```

### Task Endpoints

#### Get Tasks
```http
GET /api/weddings/:weddingId/tasks
Authorization: Bearer {token}
```

#### Create Task
```http
POST /api/weddings/:weddingId/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Book photographer",
  "description": "Contact and book the photographer",
  "category": "Vendor",
  "priority": "high",
  "status": "todo",
  "dueDate": "2025-02-01"
}
```

### Timeline Endpoints

#### Get Timeline Events
```http
GET /api/weddings/:weddingId/timeline
Authorization: Bearer {token}
```

#### Create Timeline Event
```http
POST /api/weddings/:weddingId/timeline
Authorization: Bearer {token}
Content-Type: application/json

{
  "eventName": "Ceremony",
  "eventDate": "2025-06-15",
  "startTime": "15:00",
  "endTime": "16:00",
  "location": "Garden Area",
  "eventType": "ceremony",
  "description": "Main wedding ceremony"
}
```

### Admin Endpoints (Admin Only)

#### Get Dashboard Stats
```http
GET /api/admin/stats
Authorization: Bearer {token}
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer {token}
```

#### Update User
```http
PUT /api/admin/users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "isActive": true,
  "role": "admin"
}
```

## 🎨 Features Overview

### 1. User Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Role-based access control (user/admin)
- Protected routes

### 2. Wedding Profile Management
- Create and manage multiple weddings
- Track wedding details (date, venue, budget, guest count)
- Wedding status tracking (planning, confirmed, completed, cancelled)

### 3. Guest Management
- Add, edit, delete guests
- Track RSVP status (pending, accepted, declined)
- Assign table numbers for seating
- Guest categorization (family, friend, colleague)
- Plus-one tracking
- Dietary restrictions notes

### 4. Vendor Directory & Booking
- Browse available vendors by category
- Vendor categories: venue, photographer, caterer, decorator, florist, music, makeup
- Book vendors for weddings
- Track booking status and payments
- Contract tracking

### 5. Budget Planner
- Create budget items by category
- Track estimated vs actual costs
- Real-time budget tracking
- Payment status tracking
- Budget summary and analytics

### 6. Task Checklist
- Create and manage wedding tasks
- Priority levels (low, medium, high, urgent)
- Status tracking (todo, in-progress, completed)
- Due dates
- Task categorization

### 7. Timeline & Event Scheduler
- Create wedding day timeline
- Multiple event types (ceremony, reception, rehearsal, party)
- Time and location tracking
- Event descriptions

### 8. Admin Dashboard
- User management
- Vendor management
- System statistics
- User activity monitoring

## 🎨 UI Design Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface

### Modern UI Components
- Tailwind CSS styling
- Custom color scheme (primary pink/rose)
- Smooth transitions and animations
- Icon integration (React Icons)

### User Experience
- Loading states
- Error handling
- Success notifications
- Form validation
- Intuitive navigation

## 📦 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. **Environment Variables:**
   - Set all variables from `.env` in your hosting platform
   - Update `CLIENT_URL` to your frontend URL
   - Use production database credentials

2. **Database:**
   - Provision PostgreSQL database
   - Run schema.sql to create tables
   - Update DATABASE_URL in environment

3. **Deploy:**
```bash
git push heroku main
# or
railway up
```

### Frontend Deployment (Vercel/Netlify)

1. **Build:**
```bash
npm run build
```

2. **Environment:**
   - Set `REACT_APP_API_URL` to your backend URL

3. **Deploy:**
```bash
vercel --prod
# or
netlify deploy --prod
```

### Production Checklist
- [ ] Update JWT_SECRET to strong random string
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Review security headers
- [ ] Test all API endpoints
- [ ] Verify email functionality (if added)
- [ ] Load testing

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

### Frontend Proxy Issues
- Ensure backend is running on port 5000
- Check proxy setting in frontend/package.json
- Clear browser cache

### Module Not Found
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Additional Features to Implement

- Email notifications for RSVP
- Photo gallery
- Gift registry integration
- Vendor reviews and ratings
- Calendar integration (Google Calendar, iCal)
- PDF export for guest lists, budget, timeline
- Multi-language support
- Theme customization
- Social media sharing
- Wedding website generator

## 📚 Technologies Used

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- cors

### Frontend
- React 18
- React Router DOM v6
- Axios
- Tailwind CSS
- React Icons
- date-fns
- Recharts (for charts)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@weddingplanner.com or open an issue in the repository.

---

**Happy Wedding Planning! 💍💐**
