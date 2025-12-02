-- Wedding Planner Database Schema
-- PostgreSQL Database

-- Create Database
CREATE DATABASE wedding_planner_db;

-- Connect to database
\c wedding_planner_db;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE "Users" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weddings Table
CREATE TABLE "Weddings" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    "brideName" VARCHAR(255) NOT NULL,
    "groomName" VARCHAR(255) NOT NULL,
    "weddingDate" DATE NOT NULL,
    venue VARCHAR(255),
    "venueAddress" TEXT,
    "guestCount" INTEGER DEFAULT 0,
    "totalBudget" DECIMAL(10, 2) DEFAULT 0.00,
    "spentAmount" DECIMAL(10, 2) DEFAULT 0.00,
    theme VARCHAR(255),
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'confirmed', 'completed', 'cancelled')),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guests Table
CREATE TABLE "Guests" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "weddingId" UUID NOT NULL REFERENCES "Weddings"(id) ON DELETE CASCADE,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    category VARCHAR(50) DEFAULT 'other' CHECK (category IN ('family', 'friend', 'colleague', 'other')),
    side VARCHAR(50) DEFAULT 'both' CHECK (side IN ('bride', 'groom', 'both')),
    "rsvpStatus" VARCHAR(50) DEFAULT 'pending' CHECK ("rsvpStatus" IN ('pending', 'accepted', 'declined')),
    "plusOne" BOOLEAN DEFAULT false,
    "dietaryRestrictions" TEXT,
    "tableNumber" INTEGER,
    notes TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors Table
CREATE TABLE "Vendors" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('venue', 'photographer', 'caterer', 'decorator', 'florist', 'music', 'makeup', 'other')),
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    website VARCHAR(255),
    description TEXT,
    "priceRange" VARCHAR(100),
    rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 5),
    "isVerified" BOOLEAN DEFAULT false,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE "Bookings" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "weddingId" UUID NOT NULL REFERENCES "Weddings"(id) ON DELETE CASCADE,
    "vendorId" UUID NOT NULL REFERENCES "Vendors"(id) ON DELETE CASCADE,
    "bookingDate" DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    amount DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
    "paidAmount" DECIMAL(10, 2) DEFAULT 0.00,
    notes TEXT,
    "contractSigned" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budget Items Table
CREATE TABLE "BudgetItems" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "weddingId" UUID NOT NULL REFERENCES "Weddings"(id) ON DELETE CASCADE,
    category VARCHAR(255) NOT NULL,
    "itemName" VARCHAR(255) NOT NULL,
    "estimatedCost" DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
    "actualCost" DECIMAL(10, 2) DEFAULT 0.00,
    "isPaid" BOOLEAN DEFAULT false,
    "paymentDate" DATE,
    notes TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE "Tasks" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "weddingId" UUID NOT NULL REFERENCES "Weddings"(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'completed')),
    "dueDate" DATE,
    "completedDate" DATE,
    "assignedTo" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Timeline Events Table
CREATE TABLE "TimelineEvents" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "weddingId" UUID NOT NULL REFERENCES "Weddings"(id) ON DELETE CASCADE,
    "eventName" VARCHAR(255) NOT NULL,
    "eventDate" DATE NOT NULL,
    "startTime" TIME,
    "endTime" TIME,
    location VARCHAR(255),
    description TEXT,
    "eventType" VARCHAR(50) DEFAULT 'other' CHECK ("eventType" IN ('ceremony', 'reception', 'rehearsal', 'party', 'other')),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better query performance
CREATE INDEX idx_weddings_userid ON "Weddings"("userId");
CREATE INDEX idx_guests_weddingid ON "Guests"("weddingId");
CREATE INDEX idx_bookings_weddingid ON "Bookings"("weddingId");
CREATE INDEX idx_bookings_vendorid ON "Bookings"("vendorId");
CREATE INDEX idx_budgetitems_weddingid ON "BudgetItems"("weddingId");
CREATE INDEX idx_tasks_weddingid ON "Tasks"("weddingId");
CREATE INDEX idx_timelineevents_weddingid ON "TimelineEvents"("weddingId");
CREATE INDEX idx_users_email ON "Users"(email);
CREATE INDEX idx_vendors_category ON "Vendors"(category);

-- Insert sample admin user (password: admin123)
INSERT INTO "Users" ("firstName", "lastName", email, password, role)
VALUES ('Admin', 'User', 'admin@weddingplanner.com', '$2a$10$YourHashedPasswordHere', 'admin');
