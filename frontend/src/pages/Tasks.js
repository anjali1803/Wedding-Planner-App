import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaTasks, FaCheck, FaClock, FaTimes } from 'react-icons/fa';

const Tasks = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    assignedTo: '',
    completedDate: ''
  });

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800', icon: '⬇️' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800', icon: '➖' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', icon: '⬆️' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800', icon: '🔥' }
  ];

  const statuses = [
    { value: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-800' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' }
  ];

  useEffect(() => {
    loadTasks();
  }, [id]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/weddings/${id}/tasks`);
      setTasks(response.data.data || []);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        dueDate: formData.dueDate || null,
        completedDate: formData.completedDate || null
      };

      if (editingTask) {
        await api.put(`/weddings/${id}/tasks/${editingTask.id}`, dataToSubmit);
      } else {
        await api.post(`/weddings/${id}/tasks`, dataToSubmit);
      }
      loadTasks();
      closeModal();
    } catch (err) {
      setError('Failed to save task');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/weddings/${id}/tasks/${taskId}`);
        loadTasks();
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updateData = {
        ...task,
        status: newStatus,
        completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null
      };
      await api.put(`/weddings/${id}/tasks/${taskId}`, updateData);
      loadTasks();
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        category: task.category || '',
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assignedTo: task.assignedTo || '',
        completedDate: task.completedDate ? task.completedDate.split('T')[0] : ''
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
        assignedTo: '',
        completedDate: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPriorityConfig = (priority) => {
    return priorities.find(p => p.value === priority) || priorities[1];
  };

  const getStatusConfig = (status) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'completed' || !dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => isOverdue(t.dueDate, t.status)).length
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
            <FaTasks className="mr-3 text-primary-600" />
            Task Checklist
          </h1>
          <p className="text-gray-600 mt-2">Stay on top of your wedding planning</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center space-x-2">
          <FaPlus />
          <span>Add Task</span>
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
          <h3 className="text-sm font-medium text-gray-600">Total</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
        </div>
        <div className="card bg-gray-50">
          <h3 className="text-sm font-medium text-gray-600">To Do</h3>
          <p className="text-3xl font-bold text-gray-600 mt-2">{stats.todo}</p>
        </div>
        <div className="card bg-yellow-50">
          <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.inProgress}</p>
        </div>
        <div className="card bg-green-50">
          <h3 className="text-sm font-medium text-gray-600">Completed</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
        </div>
        <div className="card bg-red-50">
          <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.overdue}</p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filterStatus === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Tasks ({tasks.length})
        </button>
        {statuses.map(status => (
          <button
            key={status.value}
            onClick={() => setFilterStatus(status.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filterStatus === status.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.label} ({tasks.filter(t => t.status === status.value).length})
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 card">
          <FaTasks className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks yet</h3>
          <p className="text-gray-500 mb-6">Start creating your wedding planning checklist!</p>
          <button onClick={() => openModal()} className="btn-primary inline-flex items-center space-x-2">
            <FaPlus />
            <span>Add Your First Task</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const priorityConfig = getPriorityConfig(task.priority);
            const statusConfig = getStatusConfig(task.status);
            const overdue = isOverdue(task.dueDate, task.status);

            return (
              <div key={task.id} className={`card hover:shadow-lg transition-shadow ${overdue ? 'border-l-4 border-red-500' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={(e) => handleStatusChange(task.id, e.target.checked ? 'completed' : 'todo')}
                        className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                    </div>

                    {task.description && (
                      <p className="text-gray-600 text-sm ml-8 mb-3">{task.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 ml-8">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig.color}`}>
                        {priorityConfig.icon} {priorityConfig.label}
                      </span>
                      {task.category && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                          {task.category}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className={`flex items-center text-xs ${overdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                          <FaClock className="mr-1" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                          {overdue && ' (Overdue!)'}
                        </span>
                      )}
                      {task.assignedTo && (
                        <span className="text-xs text-gray-600">
                          👤 {task.assignedTo}
                        </span>
                      )}
                      {task.completedDate && (
                        <span className="flex items-center text-xs text-green-600">
                          <FaCheck className="mr-1" />
                          Completed: {new Date(task.completedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button onClick={() => openModal(task)} className="text-primary-600 hover:text-primary-900 p-2">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:text-red-900 p-2">
                      <FaTrash />
                    </button>
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
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="e.g., Book wedding venue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="input"
                  placeholder="Additional details about this task"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., Venue, Catering"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="input"
                    placeholder="Person responsible"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="input">
                    {priorities.map(p => (
                      <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="input">
                    {statuses.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              {formData.status === 'completed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Completed Date</label>
                  <input
                    type="date"
                    name="completedDate"
                    value={formData.completedDate}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              )}

              <div className="flex space-x-4 pt-4 border-t">
                <button type="button" onClick={closeModal} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
