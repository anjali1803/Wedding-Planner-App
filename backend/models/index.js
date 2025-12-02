const { sequelize } = require('../config/database');
const User = require('./User');
const Wedding = require('./Wedding');
const Guest = require('./Guest');
const Vendor = require('./Vendor');
const Booking = require('./Booking');
const BudgetItem = require('./BudgetItem');
const Task = require('./Task');
const TimelineEvent = require('./TimelineEvent');

// Define relationships

// User - Wedding (One to Many)
User.hasMany(Wedding, { foreignKey: 'userId', as: 'weddings' });
Wedding.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Wedding - Guest (One to Many)
Wedding.hasMany(Guest, { foreignKey: 'weddingId', as: 'guests', onDelete: 'CASCADE' });
Guest.belongsTo(Wedding, { foreignKey: 'weddingId', as: 'wedding' });

// Wedding - Booking (One to Many)
Wedding.hasMany(Booking, { foreignKey: 'weddingId', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(Wedding, { foreignKey: 'weddingId', as: 'wedding' });

// Vendor - Booking (One to Many)
Vendor.hasMany(Booking, { foreignKey: 'vendorId', as: 'bookings' });
Booking.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

// Wedding - BudgetItem (One to Many)
Wedding.hasMany(BudgetItem, { foreignKey: 'weddingId', as: 'budgetItems', onDelete: 'CASCADE' });
BudgetItem.belongsTo(Wedding, { foreignKey: 'weddingId', as: 'wedding' });

// Wedding - Task (One to Many)
Wedding.hasMany(Task, { foreignKey: 'weddingId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Wedding, { foreignKey: 'weddingId', as: 'wedding' });

// Wedding - TimelineEvent (One to Many)
Wedding.hasMany(TimelineEvent, { foreignKey: 'weddingId', as: 'timelineEvents', onDelete: 'CASCADE' });
TimelineEvent.belongsTo(Wedding, { foreignKey: 'weddingId', as: 'wedding' });

module.exports = {
  sequelize,
  User,
  Wedding,
  Guest,
  Vendor,
  Booking,
  BudgetItem,
  Task,
  TimelineEvent
};
