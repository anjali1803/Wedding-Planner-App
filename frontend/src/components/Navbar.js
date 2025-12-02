import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaRing, FaUsers, FaBriefcase, FaDollarSign, FaTasks, FaClock, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <FaRing className="text-primary-600 text-2xl" />
              <span className="text-xl font-bold text-gray-800">Wedding Planner</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition">
              Dashboard
            </Link>
            <Link to="/vendors" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition">
              Vendors
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition">
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <p className="text-gray-700 font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-gray-500 text-xs">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
