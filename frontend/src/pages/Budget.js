import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaDollarSign, FaCheck, FaTimes, FaChartPie } from 'react-icons/fa';

const Budget = () => {
  const { id } = useParams();
  const [budgetItems, setBudgetItems] = useState([]);
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    itemName: '',
    estimatedCost: '',
    actualCost: '',
    isPaid: false,
    paymentDate: '',
    notes: ''
  });

  const categories = [
    'Venue', 'Catering', 'Photography', 'Videography', 'Flowers', 
    'Decoration', 'Music/DJ', 'Entertainment', 'Cake', 'Invitations',
    'Wedding Attire', 'Rings', 'Makeup & Hair', 'Transportation', 
    'Accommodation', 'Favors', 'Other'
  ];

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetResponse, weddingResponse] = await Promise.all([
        api.get(`/weddings/${id}/budget`),
        api.get(`/weddings/${id}`)
      ]);
      setBudgetItems(budgetResponse.data.data || []);
      setWedding(weddingResponse.data.data);
    } catch (err) {
      setError('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        estimatedCost: parseFloat(formData.estimatedCost) || 0,
        actualCost: parseFloat(formData.actualCost) || 0,
        paymentDate: formData.paymentDate || null
      };

      if (editingItem) {
        await api.put(`/weddings/${id}/budget/${editingItem.id}`, dataToSubmit);
      } else {
        await api.post(`/weddings/${id}/budget`, dataToSubmit);
      }
      loadData();
      closeModal();
    } catch (err) {
      setError('Failed to save budget item');
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this budget item?')) {
      try {
        await api.delete(`/weddings/${id}/budget/${itemId}`);
        loadData();
      } catch (err) {
        setError('Failed to delete budget item');
      }
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        category: item.category,
        itemName: item.itemName,
        estimatedCost: item.estimatedCost,
        actualCost: item.actualCost || '',
        isPaid: item.isPaid,
        paymentDate: item.paymentDate ? item.paymentDate.split('T')[0] : '',
        notes: item.notes || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        category: '',
        itemName: '',
        estimatedCost: '',
        actualCost: '',
        isPaid: false,
        paymentDate: '',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calculateTotals = () => {
    const totalEstimated = budgetItems.reduce((sum, item) => sum + parseFloat(item.estimatedCost || 0), 0);
    const totalActual = budgetItems.reduce((sum, item) => sum + parseFloat(item.actualCost || 0), 0);
    const totalPaid = budgetItems.filter(item => item.isPaid).reduce((sum, item) => sum + parseFloat(item.actualCost || item.estimatedCost || 0), 0);
    const totalBudget = wedding?.totalBudget || 0;
    
    return {
      totalEstimated,
      totalActual,
      totalPaid,
      totalBudget,
      remaining: totalBudget - totalActual,
      percentUsed: totalBudget > 0 ? (totalActual / totalBudget * 100) : 0
    };
  };

  const totals = calculateTotals();

  const getCategoryTotal = (category) => {
    return budgetItems
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + parseFloat(item.actualCost || item.estimatedCost || 0), 0);
  };

  const getCategoryData = () => {
    const categoryTotals = {};
    budgetItems.forEach(item => {
      const amount = parseFloat(item.actualCost || item.estimatedCost || 0);
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + amount;
    });
    return Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
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
            <FaDollarSign className="mr-3 text-primary-600" />
            Budget Tracker
          </h1>
          <p className="text-gray-600 mt-2">Manage your wedding expenses</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center space-x-2">
          <FaPlus />
          <span>Add Item</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-blue-50">
          <h3 className="text-sm font-medium text-gray-600">Total Budget</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">${totals.totalBudget.toLocaleString()}</p>
        </div>
        <div className="card bg-purple-50">
          <h3 className="text-sm font-medium text-gray-600">Estimated</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">${totals.totalEstimated.toLocaleString()}</p>
        </div>
        <div className="card bg-orange-50">
          <h3 className="text-sm font-medium text-gray-600">Actual Spent</h3>
          <p className="text-2xl font-bold text-orange-600 mt-2">${totals.totalActual.toLocaleString()}</p>
        </div>
        <div className={`card ${totals.remaining >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <h3 className="text-sm font-medium text-gray-600">Remaining</h3>
          <p className={`text-2xl font-bold mt-2 ${totals.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(totals.remaining).toLocaleString()}
            {totals.remaining < 0 && ' Over'}
          </p>
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Budget Usage</h3>
          <span className="text-lg font-bold text-gray-900">{totals.percentUsed.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full ${
              totals.percentUsed <= 75 ? 'bg-green-500' :
              totals.percentUsed <= 90 ? 'bg-yellow-500' :
              totals.percentUsed <= 100 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(totals.percentUsed, 100)}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          ${totals.totalActual.toLocaleString()} spent of ${totals.totalBudget.toLocaleString()} budget
        </div>
      </div>

      {/* Category Breakdown */}
      {budgetItems.length > 0 && (
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaChartPie className="mr-2 text-primary-600" />
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {getCategoryData().slice(0, 5).map(([category, amount]) => {
              const percentage = (amount / totals.totalActual * 100).toFixed(1);
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{category}</span>
                    <span className="text-gray-600">${amount.toLocaleString()} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Budget Items Table */}
      {budgetItems.length === 0 ? (
        <div className="text-center py-12 card">
          <FaDollarSign className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No budget items yet</h3>
          <p className="text-gray-500 mb-6">Start tracking your wedding expenses!</p>
          <button onClick={() => openModal()} className="btn-primary inline-flex items-center space-x-2">
            <FaPlus />
            <span>Add Your First Item</span>
          </button>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estimated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgetItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                    {item.notes && <div className="text-xs text-gray-500">{item.notes}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${parseFloat(item.estimatedCost || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${parseFloat(item.actualCost || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {item.isPaid ? 
                      <FaCheck className="text-green-600 inline" /> : 
                      <FaTimes className="text-gray-300 inline" />
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => openModal(item)} className="text-primary-600 hover:text-primary-900">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
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
                {editingItem ? 'Edit Budget Item' : 'Add Budget Item'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost *</label>
                  <input
                    type="number"
                    name="estimatedCost"
                    value={formData.estimatedCost}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Actual Cost</label>
                  <input
                    type="number"
                    name="actualCost"
                    value={formData.actualCost}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
                  <input
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    name="isPaid"
                    checked={formData.isPaid}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Payment Completed</label>
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
                  placeholder="Additional notes about this expense"
                ></textarea>
              </div>

              <div className="flex space-x-4 pt-4 border-t">
                <button type="button" onClick={closeModal} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
