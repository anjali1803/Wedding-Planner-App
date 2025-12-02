import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  FaRing, FaCalendar, FaMapMarkerAlt, FaUsers, FaDollarSign, 
  FaTasks, FaClock, FaBriefcase, FaEdit, FaArrowLeft, FaCheckCircle
} from 'react-icons/fa';

const WeddingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWedding();
  }, [id]);

  const loadWedding = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/weddings/${id}`);
      setWedding(response.data.data);
    } catch (err) {
      setError('Failed to load wedding details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDaysUntil = (weddingDate) => {
    const today = new Date();
    const wedding = new Date(weddingDate);
    const diffTime = wedding - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateBudgetPercentage = () => {
    if (!wedding?.totalBudget || wedding.totalBudget === 0) return 0;
    return (wedding.spentAmount / wedding.totalBudget * 100).toFixed(1);
  };

  const getCompletionStats = () => {
    if (!wedding) return { completed: 0, total: 0, percentage: 0 };
    
    const tasks = wedding.tasks || [];
    const completed = tasks.filter(t => t.status === 'completed').length;
    const total = tasks.length;
    const percentage = total > 0 ? (completed / total * 100).toFixed(0) : 0;
    
    return { completed, total, percentage };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !wedding) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error || 'Wedding not found'}
        </div>
        <button onClick={() => navigate('/dashboard')} className="mt-4 btn-secondary">
          <FaArrowLeft className="inline mr-2" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const daysUntil = calculateDaysUntil(wedding.weddingDate);
  const budgetPercentage = calculateBudgetPercentage();
  const completionStats = getCompletionStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/dashboard')} className="text-primary-600 hover:text-primary-800 mb-4 flex items-center">
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center">
              <FaRing className="mr-4 text-primary-600" />
              {wedding.brideName} & {wedding.groomName}
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            {daysUntil > 0 && (
              <p className="text-lg text-primary-600 font-semibold mt-1">
                {daysUntil} days to go! 🎉
              </p>
            )}
            {daysUntil === 0 && (
              <p className="text-lg text-green-600 font-semibold mt-1">
                Today is the day! 💍
              </p>
            )}
            {daysUntil < 0 && (
              <p className="text-lg text-gray-600 mt-1">
                {Math.abs(daysUntil)} days ago
              </p>
            )}
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(wedding.status)}`}>
            {wedding.status.charAt(0).toUpperCase() + wedding.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Guests</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{wedding.guestCount || 0}</p>
            </div>
            <FaUsers className="text-4xl text-blue-300" />
          </div>
        </div>

        <div className="card bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ${parseFloat(wedding.totalBudget || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">{budgetPercentage}% used</p>
            </div>
            <FaDollarSign className="text-4xl text-green-300" />
          </div>
        </div>

        <div className="card bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasks</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {completionStats.completed}/{completionStats.total}
              </p>
              <p className="text-xs text-gray-600 mt-1">{completionStats.percentage}% complete</p>
            </div>
            <FaTasks className="text-4xl text-purple-300" />
          </div>
        </div>

        <div className="card bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Events</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{wedding.timelineEvents?.length || 0}</p>
            </div>
            <FaClock className="text-4xl text-orange-300" />
          </div>
        </div>
      </div>

      {/* Wedding Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Wedding Information</h2>
            <Link to={`/wedding/create`} className="text-primary-600 hover:text-primary-800">
              <FaEdit className="inline mr-1" /> Edit
            </Link>
          </div>

          <div className="space-y-4">
            {wedding.venue && (
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-primary-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Venue</p>
                  <p className="text-gray-900">{wedding.venue}</p>
                  {wedding.venueAddress && (
                    <p className="text-sm text-gray-600">{wedding.venueAddress}</p>
                  )}
                </div>
              </div>
            )}

            {wedding.theme && (
              <div className="flex items-start">
                <FaRing className="text-primary-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Theme</p>
                  <p className="text-gray-900">{wedding.theme}</p>
                </div>
              </div>
            )}

            {wedding.description && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                <p className="text-gray-700">{wedding.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Budget Overview</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Total Budget</span>
                <span className="font-semibold">${parseFloat(wedding.totalBudget || 0).toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Spent</span>
                <span className="font-semibold text-orange-600">${parseFloat(wedding.spentAmount || 0).toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Remaining</span>
                <span className="font-semibold text-green-600">
                  ${(parseFloat(wedding.totalBudget || 0) - parseFloat(wedding.spentAmount || 0)).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="pt-3 border-t">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    budgetPercentage <= 75 ? 'bg-green-500' :
                    budgetPercentage <= 90 ? 'bg-yellow-500' :
                    budgetPercentage <= 100 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">{budgetPercentage}% of budget used</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to={`/wedding/${id}/guests`} className="card hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600">Guest List</h3>
              <p className="text-gray-600 mt-2">
                {wedding.guests?.length || 0} guests added
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Manage RSVPs and seating
              </p>
            </div>
            <FaUsers className="text-5xl text-blue-300 group-hover:text-blue-500 transition-colors" />
          </div>
        </Link>

        <Link to={`/wedding/${id}/budget`} className="card hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600">Budget</h3>
              <p className="text-gray-600 mt-2">
                {wedding.budgetItems?.length || 0} items tracked
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Track expenses and payments
              </p>
            </div>
            <FaDollarSign className="text-5xl text-green-300 group-hover:text-green-500 transition-colors" />
          </div>
        </Link>

        <Link to={`/wedding/${id}/tasks`} className="card hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600">Tasks</h3>
              <p className="text-gray-600 mt-2">
                {completionStats.completed} of {completionStats.total} completed
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Wedding planning checklist
              </p>
            </div>
            <FaTasks className="text-5xl text-purple-300 group-hover:text-purple-500 transition-colors" />
          </div>
        </Link>

        <Link to={`/wedding/${id}/timeline`} className="card hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600">Timeline</h3>
              <p className="text-gray-600 mt-2">
                {wedding.timelineEvents?.length || 0} events scheduled
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Wedding day schedule
              </p>
            </div>
            <FaClock className="text-5xl text-orange-300 group-hover:text-orange-500 transition-colors" />
          </div>
        </Link>

        <Link to={`/wedding/${id}/bookings`} className="card hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600">Bookings</h3>
              <p className="text-gray-600 mt-2">
                {wedding.bookings?.length || 0} vendors booked
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Manage vendor contracts
              </p>
            </div>
            <FaBriefcase className="text-5xl text-indigo-300 group-hover:text-indigo-500 transition-colors" />
          </div>
        </Link>

        <Link to="/vendors" className="card hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600">Vendor Directory</h3>
              <p className="text-gray-600 mt-2">
                Browse all vendors
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Find and add vendors
              </p>
            </div>
            <FaBriefcase className="text-5xl text-pink-300 group-hover:text-pink-500 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      {(wedding.tasks?.length > 0 || wedding.timelineEvents?.length > 0) && (
        <div className="mt-8 card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Updates</h2>
          <div className="space-y-3">
            {wedding.tasks?.filter(t => t.status === 'completed').slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center text-sm">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span className="text-gray-700">Task completed: <strong>{task.title}</strong></span>
              </div>
            ))}
            {wedding.timelineEvents?.slice(0, 2).map(event => (
              <div key={event.id} className="flex items-center text-sm">
                <FaCalendar className="text-primary-600 mr-3" />
                <span className="text-gray-700">Event scheduled: <strong>{event.eventName}</strong> on {new Date(event.eventDate).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeddingDetail;
