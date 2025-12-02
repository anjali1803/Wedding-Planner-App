import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaBriefcase, FaTimes, FaDollarSign, FaFileContract } from 'react-icons/fa';

const Bookings = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({
    vendorId: '',
    bookingDate: '',
    status: 'pending',
    amount: '',
    paidAmount: '',
    notes: '',
    contractSigned: false
  });

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' }
  ];

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsResponse, vendorsResponse] = await Promise.all([
        api.get(`/weddings/${id}/bookings`),
        api.get('/vendors')
      ]);
      setBookings(bookingsResponse.data.data || []);
      setVendors(vendorsResponse.data.data || []);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        paidAmount: parseFloat(formData.paidAmount) || 0
      };

      if (editingBooking) {
        await api.put(`/weddings/${id}/bookings/${editingBooking.id}`, dataToSubmit);
      } else {
        await api.post(`/weddings/${id}/bookings`, dataToSubmit);
      }
      loadData();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save booking');
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await api.delete(`/weddings/${id}/bookings/${bookingId}`);
        loadData();
      } catch (err) {
        setError('Failed to delete booking');
      }
    }
  };

  const openModal = (booking = null) => {
    if (booking) {
      setEditingBooking(booking);
      setFormData({
        vendorId: booking.vendorId,
        bookingDate: booking.bookingDate.split('T')[0],
        status: booking.status,
        amount: booking.amount,
        paidAmount: booking.paidAmount || '',
        notes: booking.notes || '',
        contractSigned: booking.contractSigned
      });
    } else {
      setEditingBooking(null);
      setFormData({
        vendorId: '',
        bookingDate: '',
        status: 'pending',
        amount: '',
        paidAmount: '',
        notes: '',
        contractSigned: false
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBooking(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getStatusConfig = (status) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const getVendorName = (vendorId) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.name : 'Unknown Vendor';
  };

  const getVendorCategory = (vendorId) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.category : '';
  };

  const calculateTotals = () => {
    const totalAmount = bookings.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
    const totalPaid = bookings.reduce((sum, b) => sum + parseFloat(b.paidAmount || 0), 0);
    const totalRemaining = totalAmount - totalPaid;
    return { totalAmount, totalPaid, totalRemaining };
  };

  const totals = calculateTotals();

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    withContract: bookings.filter(b => b.contractSigned).length
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
            Vendor Bookings
          </h1>
          <p className="text-gray-600 mt-2">Manage your vendor contracts and bookings</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center space-x-2">
          <FaPlus />
          <span>Book Vendor</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="card bg-blue-50">
          <h3 className="text-sm font-medium text-gray-600">Total Bookings</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
        </div>
        <div className="card bg-yellow-50">
          <h3 className="text-sm font-medium text-gray-600">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
        </div>
        <div className="card bg-green-50">
          <h3 className="text-sm font-medium text-gray-600">Confirmed</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.confirmed}</p>
        </div>
        <div className="card bg-purple-50">
          <h3 className="text-sm font-medium text-gray-600">Completed</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.completed}</p>
        </div>
        <div className="card bg-indigo-50">
          <h3 className="text-sm font-medium text-gray-600">With Contract</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.withContract}</p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card bg-blue-50">
          <h3 className="text-sm font-medium text-gray-600">Total Booking Amount</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">${totals.totalAmount.toLocaleString()}</p>
        </div>
        <div className="card bg-green-50">
          <h3 className="text-sm font-medium text-gray-600">Total Paid</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">${totals.totalPaid.toLocaleString()}</p>
        </div>
        <div className="card bg-orange-50">
          <h3 className="text-sm font-medium text-gray-600">Remaining Balance</h3>
          <p className="text-2xl font-bold text-orange-600 mt-2">${totals.totalRemaining.toLocaleString()}</p>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="text-center py-12 card">
          <FaBriefcase className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h3>
          <p className="text-gray-500 mb-6">Start booking vendors for your wedding!</p>
          <button onClick={() => openModal()} className="btn-primary inline-flex items-center space-x-2">
            <FaPlus />
            <span>Book Your First Vendor</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            const paymentProgress = booking.amount > 0 
              ? (parseFloat(booking.paidAmount || 0) / parseFloat(booking.amount) * 100).toFixed(0)
              : 0;

            return (
              <div key={booking.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{getVendorName(booking.vendorId)}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      {booking.contractSigned && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center">
                          <FaFileContract className="mr-1" /> Contract Signed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 capitalize">
                      📋 {getVendorCategory(booking.vendorId)} • 📅 Booked: {new Date(booking.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button onClick={() => openModal(booking)} className="text-primary-600 hover:text-primary-900 p-2">
                      <FaEdit size={20} />
                    </button>
                    <button onClick={() => handleDelete(booking.id)} className="text-red-600 hover:text-red-900 p-2">
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>

                {booking.notes && (
                  <p className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">{booking.notes}</p>
                )}

                {/* Payment Information */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Total Amount</p>
                      <p className="text-lg font-bold text-gray-900">${parseFloat(booking.amount).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Paid Amount</p>
                      <p className="text-lg font-bold text-green-600">${parseFloat(booking.paidAmount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Remaining</p>
                      <p className="text-lg font-bold text-orange-600">
                        ${(parseFloat(booking.amount) - parseFloat(booking.paidAmount || 0)).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Payment Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Payment Progress</span>
                      <span>{paymentProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          paymentProgress >= 100 ? 'bg-green-500' :
                          paymentProgress >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(paymentProgress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBooking ? 'Edit Booking' : 'Book a Vendor'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Vendor *</label>
                <select
                  name="vendorId"
                  value={formData.vendorId}
                  onChange={handleChange}
                  required
                  className="input"
                  disabled={editingBooking}
                >
                  <option value="">Choose a vendor...</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name} ({vendor.category})
                    </option>
                  ))}
                </select>
                {editingBooking && (
                  <p className="text-xs text-gray-500 mt-1">Vendor cannot be changed after booking is created</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking Date *</label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select name="status" value={formData.status} onChange={handleChange} required className="input">
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaDollarSign className="inline mr-1" />
                    Total Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="input"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaDollarSign className="inline mr-1" />
                    Paid Amount
                  </label>
                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="input"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="input"
                  placeholder="Additional notes about this booking (e.g., deposit paid, special requirements)"
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="contractSigned"
                  checked={formData.contractSigned}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900 flex items-center">
                  <FaFileContract className="mr-1" />
                  Contract Signed
                </label>
              </div>

              <div className="flex space-x-4 pt-4 border-t">
                <button type="button" onClick={closeModal} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingBooking ? 'Update Booking' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
