# 🚀 Quick Start - Wedding Planner App

## Prerequisites
- Node.js (v16+)
- PostgreSQL (v13+)
- npm or yarn

## ⚡ 5-Minute Setup

### 1️⃣ Database Setup
```bash
# Open PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE wedding_planner_db;
\q

# Import schema
psql -U postgres -d wedding_planner_db -f database/schema.sql
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
cp .env.example .env

# Edit .env file with your database credentials
# Then start the server:
npm run dev
```

### 3️⃣ Frontend Setup
```bash
# Open new terminal
cd frontend
npm install
npm start
```

### 4️⃣ Access Application
- Open browser: http://localhost:3000
- Register your first account
- Start planning your wedding! 💍

## 🔧 Troubleshooting

### Backend won't start?
- Check PostgreSQL is running
- Verify .env database credentials
- Ensure port 5000 is free

### Frontend errors?
- Delete node_modules and reinstall
- Check backend is running on port 5000
- Clear browser cache

### Database connection failed?
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart if needed
sudo systemctl restart postgresql
```

## 📝 Default .env Configuration

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=wedding_planner_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=change_this_to_random_secret
JWT_EXPIRE=7d

CLIENT_URL=http://localhost:3000
```

## 🎯 First Steps After Setup

1. **Register** at http://localhost:3000/register
2. **Create a Wedding** profile
3. **Add Guests** and track RSVPs
4. **Browse Vendors** and make bookings
5. **Set Budget** and track expenses
6. **Create Tasks** for your wedding checklist
7. **Plan Timeline** for your wedding day

## 🔐 Creating Admin User

```sql
-- Connect to database
psql -U postgres -d wedding_planner_db

-- Update user role to admin
UPDATE "Users" SET role = 'admin' WHERE email = 'your@email.com';
```

## 📚 Documentation

- **Full Guide:** See `DEVELOPMENT_GUIDE.md`
- **Project Overview:** See `PROJECT_SUMMARY.md`
- **API Docs:** Check DEVELOPMENT_GUIDE.md → API Documentation

## 🐛 Common Issues

**Port 5000 already in use:**
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

**npm ERR! code ENOENT:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Database errors:**
- Verify PostgreSQL is running
- Check database name matches .env
- Ensure user has permissions

## 📞 Need Help?

1. Check DEVELOPMENT_GUIDE.md for detailed instructions
2. Review error messages carefully
3. Verify all prerequisites are installed
4. Check database connection

---

**Happy Planning! 💐🎉**
