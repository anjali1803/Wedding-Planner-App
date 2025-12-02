import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWedding } from '../services/weddingService';
import { FaRing, FaCalendar, FaMapMarkerAlt, FaUsers, FaDollarSign } from 'react-icons/fa';

const WeddingCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    venue: '',
    guestCount: '',
    totalBudget: '',
    status: 'planning'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await createWedding({
        ...formData,
        guestCount: parseInt(formData.guestCount) || 0,
        totalBudget: parseFloat(formData.totalBudget) || 0
      });
      
      // Navigate to the wedding detail page
      navigate(`/wedding/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create wedding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FaRing className="mr-3 text-primary-600" />
          Create Your Wedding
        </h1>
        <p className="text-gray-600 mt-2">Let's start planning your special day!</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          {/* Bride and Groom Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="brideName" className="block text-sm font-medium text-gray-700 mb-2">
                Bride's Name *
              </label>
              <input
                type="text"
                id="brideName"
                name="brideName"
                value={formData.brideName}
                onChange={handleChange}
                required
                className="input"
                placeholder="Enter bride's name"
              />
            </div>
            <div>
              <label htmlFor="groomName" className="block text-sm font-medium text-gray-700 mb-2">
                Groom's Name *
              </label>
              <input
                type="text"
                id="groomName"
                name="groomName"
                value={formData.groomName}
                onChange={handleChange}
                required
                className="input"
                placeholder="Enter groom's name"
              />
            </div>
          </div>

          {/* Wedding Date */}
          <div>
            <label htmlFor="weddingDate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaCalendar className="mr-2 text-primary-600" />
              Wedding Date *
            </label>
            <input
              type="date"
              id="weddingDate"
              name="weddingDate"
              value={formData.weddingDate}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          {/* Venue */}
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-primary-600" />
              Venue
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="input"
              placeholder="Enter venue name or location"
            />
          </div>

          {/* Guest Count and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaUsers className="mr-2 text-primary-600" />
                Expected Guest Count
              </label>
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                min="0"
                className="input"
                placeholder="Number of guests"
              />
            </div>
            <div>
              <label htmlFor="totalBudget" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaDollarSign className="mr-2 text-primary-600" />
                Total Budget
              </label>
              <input
                type="number"
                id="totalBudget"
                name="totalBudget"
                value={formData.totalBudget}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="input"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Wedding Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value="planning">Planning</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Wedding'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WeddingCreate;
