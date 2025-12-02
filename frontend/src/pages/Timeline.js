import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

const Timeline = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    eventType: 'other'
  });

  const eventTypes = [
    { value: 'ceremony', label: 'Ceremony', icon: '💒', color: 'bg-pink-100 text-pink-800' },
    { value: 'reception', label: 'Reception', icon: '🎉', color: 'bg-purple-100 text-purple-800' },
    { value: 'rehearsal', label: 'Rehearsal', icon: '🎭', color: 'bg-blue-100 text-blue-800' },
    { value: 'party', label: 'Party', icon: '🥳', color: 'bg-orange-100 text-orange-800' },
    { value: 'other', label: 'Other', icon: '📅', color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    loadEvents();
  }, [id]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/weddings/${id}/timeline`);
      const sortedEvents = (response.data.data || []).sort((a, b) => {
        const dateA = new Date(`${a.eventDate}T${a.startTime || '00:00'}`);
        const dateB = new Date(`${b.eventDate}T${b.startTime || '00:00'}`);
        return dateA - dateB;
      });
      setEvents(sortedEvents);
    } catch (err) {
      setError('Failed to load timeline events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        startTime: formData.startTime || null,
        endTime: formData.endTime || null
      };

      if (editingEvent) {
        await api.put(`/weddings/${id}/timeline/${editingEvent.id}`, dataToSubmit);
      } else {
        await api.post(`/weddings/${id}/timeline`, dataToSubmit);
      }
      loadEvents();
      closeModal();
    } catch (err) {
      setError('Failed to save timeline event');
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/weddings/${id}/timeline/${eventId}`);
        loadEvents();
      } catch (err) {
        setError('Failed to delete event');
      }
    }
  };

  const openModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        eventName: event.eventName,
        eventDate: event.eventDate.split('T')[0],
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        location: event.location || '',
        description: event.description || '',
        eventType: event.eventType
      });
    } else {
      setEditingEvent(null);
      setFormData({
        eventName: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        eventType: 'other'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getEventTypeConfig = (type) => {
    return eventTypes.find(t => t.value === type) || eventTypes[4];
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const groupEventsByDate = () => {
    const grouped = {};
    events.forEach(event => {
      const date = new Date(event.eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate();

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
            <FaCalendarAlt className="mr-3 text-primary-600" />
            Wedding Timeline
          </h1>
          <p className="text-gray-600 mt-2">Plan your wedding day schedule</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center space-x-2">
          <FaPlus />
          <span>Add Event</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="card bg-blue-50">
          <h3 className="text-sm font-medium text-gray-600">Total Events</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{events.length}</p>
        </div>
        {eventTypes.slice(0, 4).map(type => (
          <div key={type.value} className={`card ${type.color.replace('text', 'bg').replace('800', '50')}`}>
            <h3 className="text-sm font-medium text-gray-600">{type.icon} {type.label}</h3>
            <p className="text-3xl font-bold mt-2" style={{ color: type.color.split(' ')[1].replace('text-', '') }}>
              {events.filter(e => e.eventType === type.value).length}
            </p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      {events.length === 0 ? (
        <div className="text-center py-12 card">
          <FaCalendarAlt className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No events yet</h3>
          <p className="text-gray-500 mb-6">Start planning your wedding day timeline!</p>
          <button onClick={() => openModal()} className="btn-primary inline-flex items-center space-x-2">
            <FaPlus />
            <span>Add Your First Event</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <div key={date} className="relative">
              <div className="sticky top-0 bg-white z-10 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaCalendarAlt className="mr-3 text-primary-600" />
                  {date}
                </h2>
              </div>
              
              <div className="relative pl-8 border-l-4 border-primary-200">
                {dateEvents.map((event, index) => {
                  const typeConfig = getEventTypeConfig(event.eventType);
                  
                  return (
                    <div key={event.id} className="mb-6 relative">
                      <div className="absolute -left-10 mt-2 w-6 h-6 rounded-full bg-primary-600 border-4 border-white"></div>
                      
                      <div className="card hover:shadow-lg transition-shadow ml-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl">{typeConfig.icon}</span>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{event.eventName}</h3>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${typeConfig.color} mt-1`}>
                                {typeConfig.label}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => openModal(event)} className="text-primary-600 hover:text-primary-900 p-2">
                              <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-900 p-2">
                              <FaTrash />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          {(event.startTime || event.endTime) && (
                            <div className="flex items-center text-gray-700">
                              <FaClock className="mr-2 text-primary-600" />
                              <span className="font-semibold">
                                {event.startTime && formatTime(event.startTime)}
                                {event.startTime && event.endTime && ' - '}
                                {event.endTime && formatTime(event.endTime)}
                              </span>
                            </div>
                          )}
                          
                          {event.location && (
                            <div className="flex items-center text-gray-700">
                              <FaMapMarkerAlt className="mr-2 text-primary-600" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          {event.description && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-gray-600">{event.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                {editingEvent ? 'Edit Timeline Event' : 'Add Timeline Event'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="e.g., Wedding Ceremony"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
                  <select name="eventType" value={formData.eventType} onChange={handleChange} required className="input">
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input"
                  placeholder="Event location or venue"
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
                  placeholder="Additional details about this event"
                ></textarea>
              </div>

              <div className="flex space-x-4 pt-4 border-t">
                <button type="button" onClick={closeModal} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
