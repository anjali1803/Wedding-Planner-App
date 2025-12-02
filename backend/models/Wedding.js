const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Wedding = sequelize.define('Wedding', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  brideName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  groomName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  weddingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: true
  },
  venueAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  guestCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalBudget: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  spentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  theme: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('planning', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'planning'
  }
}, {
  timestamps: true
});

module.exports = Wedding;
