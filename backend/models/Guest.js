const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Guest = sequelize.define('Guest', {
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
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('family', 'friend', 'colleague', 'other'),
    defaultValue: 'other'
  },
  side: {
    type: DataTypes.ENUM('bride', 'groom', 'both'),
    defaultValue: 'both'
  },
  rsvpStatus: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined'),
    defaultValue: 'pending'
  },
  plusOne: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  dietaryRestrictions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tableNumber: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Guest;
