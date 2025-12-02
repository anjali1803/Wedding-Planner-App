import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaCheck, FaTimes, FaUser } from 'react-icons/fa';

const Guests = () => {
  const { id } = useParams();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    category: 'other',
    side: 'both',
    rsvpStatus: 'pending',
    plusOne: false,
    dietaryRestrictions: '',
    tableNumber: '',
    notes: ''
  });

  useEffect(() => {
    loadGuests();
  }, [id]);

  const loadGuests = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/weddings/${id}/guests`);
      setGuests(response.data.data || []);
    } catch (err) {
      setError('Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGuest) {
        await api.put(`/weddings/${id}/guests/${editingGuest.id}`, formData);
      } else {
        await api.post(`/weddings/${id}/guests`, formData);
      }
      loadGuests();
      closeModal();
    } catch (err) {
      setError('Failed to save guest');
    }
  };

  const handleDelete = async (guestId) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await api.delete(`/weddings/${id}/guests/${guestId}`);
        loadGuests();
      } catch (err) {
        setError('Failed to delete guest');
      }
    }
  };

  const openModal = (guest = null) => {
    if (guest) {
      setEditingGuest(guest);
      setFormData({
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email || '',
        phone: guest.phone || '',
        category: guest.category,
        side: guest.side,
        rsvpStatus: guest.rsvpStatus,
        plusOne: guest.plusOne,
        dietaryRestrictions: guest.dietaryRestrictions || '',
        tableNumber: guest.tableNumber || '',
        notes: guest.notes || ''
      });
    } else {
      setEditingGuest(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        category: 'other',
        side: 'both',
        rsvpStatus: 'pending',
        plusOne: false,
        dietaryRestrictions: '',
        tableNumber: '',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGuest(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'family': return 'bg-purple-100 text-purple-800';
      case 'friend': return 'bg-blue-100 text-blue-800';
      case 'colleague': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getSideIcon = (side) => {
    return side === 'bride' ? '👰' : side === 'groom' ? '🤵' : '💑';
  };

  const stats = {
    total: guests.length,
    accepted: guests.filter(g => g.rsvpStatus === 'accepted').length,
    declined: guests.filter(g => g.rsvpStatus === 'declined').length,
    pending: guests.filter(g => g.rsvpStatus === 'pending').length
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaUsers className="mr-3 text-primary-600" />
            Guest Management
          </h1>
          <p className="text-gray-600 mt-2">Manage your wedding guest list and RSVPs</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center space-x-2">
          <FaPlus />
          <span>Add Guest</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-blue-50">
          <h3 className="text-sm font-medium text-gray-600">Total Guests</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
        </div>
        <div className="card bg-green-50">
          <h3 className="text-sm font-medium text-gray-600">Accepted</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.accepted}</p>
        </div>
        <div className="card bg-red-50">
          <h3 className="text-sm font-medium text-gray-600">Declined</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.declined}</p>
        </div>
        <div className="card bg-yellow-50">
          <h3 className="text-sm font-medium text-gray-600">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
        </div>
      </div>

      {/* Guests Table */}
      {guests.length === 0 ? (
        <div className="text-center py-12 card">
          <FaUser className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No guests yet</h3>
          <p className="text-gray-500 mb-6">Start adding guests to your wedding!</p>
          <button onClick={() => openModal()} className="btn-primary inline-flex items-center space-x-2">
            <FaPlus />
            <span>Add Your First Guest</span>
          </button>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Side</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RSVP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plus One</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {guest.firstName} {guest.lastName}
                    </div>
                    {guest.dietaryRestrictions && (
                      <div className="text-xs text-gray-500">🍽️ {guest.dietaryRestrictions}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{guest.email || '-'}</div>
                    <div className="text-xs text-gray-500">{guest.phone || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-2xl">{getSideIcon(guest.side)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(guest.category)}`}>
                      {guest.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(guest.rsvpStatus)}`}>
                      {guest.rsvpStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {guest.plusOne ? <FaCheck className="text-green-600" /> : <FaTimes className="text-gray-300" />}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {guest.tableNumber || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => openModal(guest)} className="text-primary-600 hover:text-primary-900">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(guest.id)} className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingGuest ? 'Edit Guest' : 'Add New Guest'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Side</label>
                  <select name="side" value={formData.side} onChange={handleChange} className="input">
                    <option value="bride">Bride</option>
                    <option value="groom">Groom</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="input">
                    <option value="family">Family</option>
                    <option value="friend">Friend</option>
                    <option value="colleague">Colleague</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">RSVP Status</label>
                  <select name="rsvpStatus" value={formData.rsvpStatus} onChange={handleChange} className="input">
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Table Number</label>
                  <input
                    type="number"
                    name="tableNumber"
                    value={formData.tableNumber}
                    onChange={handleChange}
                    className="input"
                    min="1"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    name="plusOne"
                    checked={formData.plusOne}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Plus One Allowed</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
                <input
                  type="text"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Vegetarian, Gluten-free, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="input"
                  placeholder="Any additional notes about this guest"
                ></textarea>
              </div>

              <div className="flex space-x-4 pt-4 border-t">
                <button type="button" onClick={closeModal} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingGuest ? 'Update Guest' : 'Add Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guests;
