const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TimelineEvent = sequelize.define('TimelineEvent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  weddingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Weddings',
      key: 'id'
    }
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eventDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  eventType: {
    type: DataTypes.ENUM('ceremony', 'reception', 'rehearsal', 'party', 'other'),
    defaultValue: 'other'
  }
}, {
  timestamps: true
});

module.exports = TimelineEvent;
