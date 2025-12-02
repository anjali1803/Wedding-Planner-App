import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WeddingCreate from './pages/WeddingCreate';
import WeddingDetail from './pages/WeddingDetail';
import Guests from './pages/Guests';
import Vendors from './pages/Vendors';
import Bookings from './pages/Bookings';
import Budget from './pages/Budget';
import Tasks from './pages/Tasks';
import Timeline from './pages/Timeline';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import './index.css';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <div className={isAuthenticated ? 'pt-16' : ''}>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/wedding/create" element={
            <PrivateRoute><WeddingCreate /></PrivateRoute>
          } />
          <Route path="/wedding/:id" element={
            <PrivateRoute><WeddingDetail /></PrivateRoute>
          } />
          <Route path="/wedding/:id/guests" element={
            <PrivateRoute><Guests /></PrivateRoute>
          } />
          <Route path="/vendors" element={
            <PrivateRoute><Vendors /></PrivateRoute>
          } />
          <Route path="/wedding/:id/bookings" element={
            <PrivateRoute><Bookings /></PrivateRoute>
          } />
          <Route path="/wedding/:id/budget" element={
            <PrivateRoute><Budget /></PrivateRoute>
          } />
          <Route path="/wedding/:id/tasks" element={
            <PrivateRoute><Tasks /></PrivateRoute>
          } />
          <Route path="/wedding/:id/timeline" element={
            <PrivateRoute><Timeline /></PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>
          } />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
