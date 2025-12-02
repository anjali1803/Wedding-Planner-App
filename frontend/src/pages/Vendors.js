import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaBriefcase, FaStar, FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaCheck, FaTimes } from 'react-icons/fa';

const Vendors = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: 'venue',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    priceRange: '',
    rating: '',
    isVerified: false,
    isActive: true
  });

  const categories = [
    { value: 'venue', label: 'Venue', icon: '🏛️' },
    { value: 'photographer', label: 'Photographer', icon: '📸' },
    { value: 'caterer', label: 'Caterer', icon: '🍽️' },
    { value: 'decorator', label: 'Decorator', icon: '🎨' },
    { value: 'florist', label: 'Florist', icon: '💐' },
    { value: 'music', label: 'Music/DJ', icon: '🎵' },
    { value: 'makeup', label: 'Makeup', icon: '💄' },
    { value: 'other', label: 'Other', icon: '📋' }
  ];

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vendors');
      setVendors(response.data.data || []);
    } catch (err) {
      setError('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : null
      };

      if (editingVendor) {
        await api.put(`/vendors/${editingVendor.id}`, dataToSubmit);
      } else {
        await api.post('/vendors', dataToSubmit);
      }
      loadVendors();
      closeModal();
    } catch (err) {
      console.error('Vendor save error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to save vendor');
    }
  };

  const handleDelete = async (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await api.delete(`/vendors/${vendorId}`);
        loadVendors();
      } catch (err) {
        setError('Failed to delete vendor');
      }
    }
  };

  const openModal = (vendor = null) => {
    if (vendor) {
      setEditingVendor(vendor);
      setFormData({
        name: vendor.name,
        category: vendor.category,
        email: vendor.email || '',
        phone: vendor.phone,
        address: vendor.address || '',
        website: vendor.website || '',
        description: vendor.description || '',
        priceRange: vendor.priceRange || '',
        rating: vendor.rating || '',
        isVerified: vendor.isVerified,
        isActive: vendor.isActive
      });
    } else {
      setEditingVendor(null);
      setFormData({
        name: '',
        category: 'venue',
        email: '',
        phone: '',
        address: '',
        website: '',
        description: '',
        priceRange: '',
        rating: '',
        isVerified: false,
        isActive: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVendor(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const filteredVendors = selectedCategory === 'all'
    ? vendors
    : vendors.filter(v => v.category === selectedCategory);

  const getCategoryIcon = (category) => {
    return categories.find(c => c.value === category)?.icon || '📋';
  };

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2;
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
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
            <FaBriefcase className="mr-3 text-primary-600" />
            Vendor Directory
          </h1>
          <p className="text-gray-600 mt-2">Browse and manage wedding vendors</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center space-x-2">
          <FaPlus />
          <span>Add Vendor</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedCategory === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({vendors.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === cat.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.icon} {cat.label} ({vendors.filter(v => v.category === cat.value).length})
          </button>
        ))}
      </div>

      {/* Vendors Grid */}
      {filteredVendors.length === 0 ? (
        <div className="text-center py-12 card">
          <FaBriefcase className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No vendors found</h3>
          <p className="text-gray-500 mb-6">Start adding vendors to your directory!</p>
          <button onClick={() => openModal()} className="btn-primary inline-flex items-center space-x-2">
            <FaPlus />
            <span>Add Your First Vendor</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{getCategoryIcon(vendor.category)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                    <span className="text-xs text-gray-500 capitalize">{vendor.category}</span>
                  </div>
                </div>
                {vendor.isVerified && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <FaCheck className="mr-1" /> Verified
                  </span>
                )}
              </div>

              {vendor.rating && (
                <div className="flex items-center space-x-1 mb-3">
                  {renderStars(vendor.rating)}
                  <span className="text-sm text-gray-600 ml-2">({vendor.rating})</span>
                </div>
              )}

              {vendor.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{vendor.description}</p>
              )}

              <div className="space-y-2 mb-4 text-sm">
                {vendor.phone && (
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="mr-2 text-primary-600" />
                    {vendor.phone}
                  </div>
                )}
                {vendor.email && (
                  <div className="flex items-center text-gray-600">
                    <FaEnvelope className="mr-2 text-primary-600" />
                    {vendor.email}
                  </div>
                )}
                {vendor.address && (
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-primary-600" />
                    {vendor.address}
                  </div>
                )}
                {vendor.website && (
                  <div className="flex items-center text-gray-600">
                    <FaGlobe className="mr-2 text-primary-600" />
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
                {vendor.priceRange && (
                  <div className="text-gray-900 font-semibold">
                    💰 {vendor.priceRange}
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <button onClick={() => openModal(vendor)} className="flex-1 btn-secondary text-sm py-2">
                  <FaEdit className="inline mr-1" /> Edit
                </button>
                <button onClick={() => handleDelete(vendor.id)} className="btn-danger px-4 py-2">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange} required className="input">
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <input
                    type="text"
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., $1,000 - $5,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="input"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="input"
                  placeholder="Brief description of the vendor's services"
                ></textarea>
              </div>

              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Verified Vendor</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Active</label>
                </div>
              </div>

              <div className="flex space-x-4 pt-4 border-t">
                <button type="button" onClick={closeModal} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingVendor ? 'Update Vendor' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
