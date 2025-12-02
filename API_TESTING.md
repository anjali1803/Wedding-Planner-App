# API Testing Guide - Wedding Planner

Complete collection of API endpoints with example requests and responses.

## 🔧 Testing Tools

You can use any of these tools:
- **Postman** (Recommended)
- **Thunder Client** (VS Code Extension)
- **curl** (Command Line)
- **Insomnia**

## 🔐 Authentication Required

Most endpoints require a JWT token. Include it in the header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📝 1. AUTHENTICATION ENDPOINTS

### 1.1 Register User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

### 1.2 Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

### 1.3 Get Current User
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "role": "user",
    "isActive": true
  }
}
```

---

## 💍 2. WEDDING ENDPOINTS

### 2.1 Get All Weddings
```http
GET http://localhost:5000/api/weddings
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "wedding-uuid",
      "brideName": "Jane Smith",
      "groomName": "John Doe",
      "weddingDate": "2025-06-15",
      "venue": "Grand Hotel",
      "guestCount": 150,
      "totalBudget": "50000.00",
      "status": "planning"
    }
  ]
}
```

### 2.2 Create Wedding
```http
POST http://localhost:5000/api/weddings
Authorization: Bearer <token>
Content-Type: application/json

{
  "brideName": "Jane Smith",
  "groomName": "John Doe",
  "weddingDate": "2025-06-15",
  "venue": "Grand Hotel",
  "venueAddress": "123 Main Street, New York, NY 10001",
  "totalBudget": 50000,
  "theme": "Rustic Garden",
  "description": "Elegant outdoor wedding with garden theme"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "wedding-uuid",
    "userId": "user-uuid",
    "brideName": "Jane Smith",
    "groomName": "John Doe",
    "weddingDate": "2025-06-15",
    "venue": "Grand Hotel",
    "venueAddress": "123 Main Street, New York, NY 10001",
    "guestCount": 0,
    "totalBudget": "50000.00",
    "spentAmount": "0.00",
    "theme": "Rustic Garden",
    "description": "Elegant outdoor wedding with garden theme",
    "status": "planning"
  }
}
```

### 2.3 Get Single Wedding (with details)
```http
GET http://localhost:5000/api/weddings/<wedding-id>
Authorization: Bearer <token>
```

### 2.4 Update Wedding
```http
PUT http://localhost:5000/api/weddings/<wedding-id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "venue": "Updated Venue Name",
  "status": "confirmed",
  "guestCount": 175
}
```

### 2.5 Delete Wedding
```http
DELETE http://localhost:5000/api/weddings/<wedding-id>
Authorization: Bearer <token>
```

---

## 👥 3. GUEST ENDPOINTS

### 3.1 Get All Guests for a Wedding
```http
GET http://localhost:5000/api/weddings/<wedding-id>/guests
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "guest-uuid",
      "firstName": "Alice",
      "lastName": "Johnson",
      "email": "alice@example.com",
      "phone": "+1234567890",
      "category": "friend",
      "side": "bride",
      "rsvpStatus": "accepted",
      "plusOne": true,
      "tableNumber": 5
    }
  ]
}
```

### 3.2 Add Guest
```http
POST http://localhost:5000/api/weddings/<wedding-id>/guests
Authorization: Bearer <token>
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
  "dietaryRestrictions": "Vegetarian",
  "tableNumber": 5,
  "notes": "Childhood friend"
}
```

### 3.3 Update Guest
```http
PUT http://localhost:5000/api/guests/<guest-id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "rsvpStatus": "accepted",
  "tableNumber": 3
}
```

### 3.4 Delete Guest
```http
DELETE http://localhost:5000/api/guests/<guest-id>
Authorization: Bearer <token>
```

---

## 🏢 4. VENDOR ENDPOINTS

### 4.1 Get All Vendors (with filters)
```http
GET http://localhost:5000/api/vendors?category=photographer&search=pro
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "vendor-uuid",
      "name": "Pro Photography Studio",
      "category": "photographer",
      "email": "contact@prophotography.com",
      "phone": "+1234567890",
      "address": "456 Studio Avenue",
      "website": "https://prophotography.com",
      "description": "Award-winning wedding photography",
      "priceRange": "$2000-$5000",
      "rating": "4.8",
      "isVerified": true,
      "isActive": true
    }
  ]
}
```

### 4.2 Create Vendor (Admin Only)
```http
POST http://localhost:5000/api/vendors
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Elite Catering Services",
  "category": "caterer",
  "email": "info@elitecatering.com",
  "phone": "+1234567890",
  "address": "789 Food Street",
  "website": "https://elitecatering.com",
  "description": "Premium catering for weddings",
  "priceRange": "$50-$100 per person",
  "rating": 4.9
}
```

### 4.3 Get Vendor Details
```http
GET http://localhost:5000/api/vendors/<vendor-id>
Authorization: Bearer <token>
```

### 4.4 Update Vendor (Admin Only)
```http
PUT http://localhost:5000/api/vendors/<vendor-id>
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "rating": 4.9,
  "isVerified": true
}
```

### 4.5 Delete Vendor (Admin Only)
```http
DELETE http://localhost:5000/api/vendors/<vendor-id>
Authorization: Bearer <admin-token>
```

---

## 📅 5. BOOKING ENDPOINTS

### 5.1 Get All Bookings for a Wedding
```http
GET http://localhost:5000/api/weddings/<wedding-id>/bookings
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "booking-uuid",
      "weddingId": "wedding-uuid",
      "vendorId": "vendor-uuid",
      "bookingDate": "2025-06-15",
      "status": "confirmed",
      "amount": "3000.00",
      "paidAmount": "1500.00",
      "contractSigned": true,
      "vendor": {
        "name": "Pro Photography Studio",
        "category": "photographer",
        "phone": "+1234567890"
      }
    }
  ]
}
```

### 5.2 Create Booking
```http
POST http://localhost:5000/api/weddings/<wedding-id>/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendorId": "vendor-uuid",
  "bookingDate": "2025-06-15",
  "status": "confirmed",
  "amount": 3000,
  "paidAmount": 1500,
  "notes": "Includes engagement photos",
  "contractSigned": true
}
```

### 5.3 Update Booking
```http
PUT http://localhost:5000/api/bookings/<booking-id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "paidAmount": 3000
}
```

### 5.4 Delete Booking
```http
DELETE http://localhost:5000/api/bookings/<booking-id>
Authorization: Bearer <token>
```

---

## 💰 6. BUDGET ENDPOINTS

### 6.1 Get Budget Items
```http
GET http://localhost:5000/api/weddings/<wedding-id>/budget
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "budget-uuid",
      "category": "Venue",
      "itemName": "Hall Rental",
      "estimatedCost": "5000.00",
      "actualCost": "4800.00",
      "isPaid": true,
      "paymentDate": "2025-01-15"
    }
  ],
  "summary": {
    "totalBudget": 50000,
    "totalEstimated": 45000,
    "totalActual": 43000,
    "remaining": 7000
  }
}
```

### 6.2 Create Budget Item
```http
POST http://localhost:5000/api/weddings/<wedding-id>/budget
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "Venue",
  "itemName": "Hall Rental",
  "estimatedCost": 5000,
  "actualCost": 4800,
  "isPaid": true,
  "paymentDate": "2025-01-15",
  "notes": "Includes tables and chairs"
}
```

### 6.3 Update Budget Item
```http
PUT http://localhost:5000/api/budget/<budget-id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "actualCost": 5000,
  "isPaid": true,
  "paymentDate": "2025-01-20"
}
```

### 6.4 Delete Budget Item
```http
DELETE http://localhost:5000/api/budget/<budget-id>
Authorization: Bearer <token>
```

---

## ✅ 7. TASK ENDPOINTS

### 7.1 Get All Tasks
```http
GET http://localhost:5000/api/weddings/<wedding-id>/tasks
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "task-uuid",
      "title": "Book photographer",
      "description": "Contact and finalize photographer booking",
      "category": "Vendor",
      "priority": "high",
      "status": "completed",
      "dueDate": "2025-02-01",
      "completedDate": "2025-01-28",
      "assignedTo": "John"
    }
  ]
}
```

### 7.2 Create Task
```http
POST http://localhost:5000/api/weddings/<wedding-id>/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Send invitations",
  "description": "Mail wedding invitations to all guests",
  "category": "Invitations",
  "priority": "high",
  "status": "todo",
  "dueDate": "2025-03-01",
  "assignedTo": "Jane"
}
```

### 7.3 Update Task
```http
PUT http://localhost:5000/api/tasks/<task-id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "completedDate": "2025-02-28"
}
```

### 7.4 Delete Task
```http
DELETE http://localhost:5000/api/tasks/<task-id>
Authorization: Bearer <token>
```

---

## 🕐 8. TIMELINE ENDPOINTS

### 8.1 Get Timeline Events
```http
GET http://localhost:5000/api/weddings/<wedding-id>/timeline
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "event-uuid",
      "eventName": "Wedding Ceremony",
      "eventDate": "2025-06-15",
      "startTime": "15:00:00",
      "endTime": "16:00:00",
      "location": "Garden Area",
      "description": "Main wedding ceremony",
      "eventType": "ceremony"
    }
  ]
}
```

### 8.2 Create Timeline Event
```http
POST http://localhost:5000/api/weddings/<wedding-id>/timeline
Authorization: Bearer <token>
Content-Type: application/json

{
  "eventName": "Reception Dinner",
  "eventDate": "2025-06-15",
  "startTime": "18:00",
  "endTime": "22:00",
  "location": "Grand Ballroom",
  "description": "Dinner and dancing",
  "eventType": "reception"
}
```

### 8.3 Update Timeline Event
```http
PUT http://localhost:5000/api/timeline/<event-id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "startTime": "18:30",
  "location": "Main Ballroom"
}
```

### 8.4 Delete Timeline Event
```http
DELETE http://localhost:5000/api/timeline/<event-id>
Authorization: Bearer <token>
```

---

## 👑 9. ADMIN ENDPOINTS

### 9.1 Get Dashboard Statistics
```http
GET http://localhost:5000/api/admin/stats
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 150,
      "totalWeddings": 75,
      "totalVendors": 45,
      "activeWeddings": 30
    },
    "recentUsers": [...],
    "recentWeddings": [...]
  }
}
```

### 9.2 Get All Users
```http
GET http://localhost:5000/api/admin/users
Authorization: Bearer <admin-token>
```

### 9.3 Update User
```http
PUT http://localhost:5000/api/admin/users/<user-id>
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "role": "admin",
  "isActive": true
}
```

### 9.4 Delete User
```http
DELETE http://localhost:5000/api/admin/users/<user-id>
Authorization: Bearer <admin-token>
```

---

## 🧪 Testing Workflow Example

### 1. Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "test123",
    "phone": "+1234567890"
  }'
```

### 2. Save the token from response

### 3. Create a wedding
```bash
curl -X POST http://localhost:5000/api/weddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "brideName": "Jane",
    "groomName": "John",
    "weddingDate": "2025-12-25",
    "venue": "Test Venue",
    "totalBudget": 10000
  }'
```

### 4. Add a guest
```bash
curl -X POST http://localhost:5000/api/weddings/WEDDING_ID/guests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "firstName": "Guest",
    "lastName": "One",
    "email": "guest@example.com",
    "category": "friend",
    "rsvpStatus": "pending"
  }'
```

---

## 📊 Response Status Codes

- **200** - OK (Successful GET, PUT, DELETE)
- **201** - Created (Successful POST)
- **400** - Bad Request (Invalid data)
- **401** - Unauthorized (Missing or invalid token)
- **403** - Forbidden (Insufficient permissions)
- **404** - Not Found (Resource doesn't exist)
- **500** - Internal Server Error

---

## 🔍 Common Errors

### Missing Token
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Invalid Credentials
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Duplicate Email
```json
{
  "success": false,
  "message": "User already exists"
}
```

### Not Found
```json
{
  "success": false,
  "message": "Wedding not found"
}
```

---

**Happy Testing! 🧪✨**
