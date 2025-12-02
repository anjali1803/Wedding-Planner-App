const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BudgetItem = sequelize.define('BudgetItem', {
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
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estimatedCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  actualCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = BudgetItem;
