import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWeddings, deleteWedding } from '../services/weddingService';
import { FaPlus, FaCalendar, FaUsers, FaDollarSign, FaTrash, FaEdit } from 'react-icons/fa';

const Dashboard = () => {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWeddings();
  }, []);

  const loadWeddings = async () => {
    try {
      setLoading(true);
      const response = await getWeddings();
      setWeddings(response.data);
    } catch (err) {
      setError('Failed to load weddings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this wedding?')) {
      try {
        await deleteWedding(id);
        loadWeddings();
      } catch (err) {
        setError('Failed to delete wedding');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">The Planning Studio</h1>
          <p className="text-gray-600 mt-2">Your one place for all wedding plans</p>
        </div>
        <Link to="/wedding/create" className="btn-primary flex items-center space-x-2">
          <FaPlus />
          <span>Create Wedding</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {weddings.length === 0 ? (
        <div className="text-center py-12">
          <FaCalendar className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No weddings yet</h3>
          <p className="text-gray-500 mb-6">Create your first wedding to start planning!</p>
          <Link to="/wedding/create" className="btn-primary inline-flex items-center space-x-2">
            <FaPlus />
            <span>Create Your First Wedding</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddings.map((wedding) => (
            <div key={wedding.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {wedding.brideName} & {wedding.groomName}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(wedding.weddingDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  wedding.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                  wedding.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  wedding.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {wedding.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <FaCalendar className="mr-2" />
                  <span className="text-sm">{wedding.venue || 'No venue set'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaUsers className="mr-2" />
                  <span className="text-sm">{wedding.guestCount} Guests</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaDollarSign className="mr-2" />
                  <span className="text-sm">
                    ${parseFloat(wedding.spentAmount || 0).toLocaleString()} / 
                    ${parseFloat(wedding.totalBudget || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <Link
                  to={`/wedding/${wedding.id}`}
                  className="flex-1 btn-primary text-center py-2"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(wedding.id)}
                  className="btn-danger px-4 py-2"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
