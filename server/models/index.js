const { sequelize } = require('../config/database');
const User = require('./User');
const Booking = require('./Booking');
const Contact = require('./Contact');

// Define associations if needed
// User.hasMany(Booking);
// Booking.belongsTo(User);

module.exports = {
  sequelize,
  User,
  Booking,
  Contact
};
