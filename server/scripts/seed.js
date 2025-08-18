const { sequelize, User } = require('../models');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync database models
    await sequelize.sync({ force: false });
    console.log('Database models synchronized.');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      where: { email: process.env.ADMIN_EMAIL || 'admin@srishtithefarm.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@srishtithefarm.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      isActive: true
    });

    console.log('Admin user created successfully:', adminUser.email);
    console.log('Default password:', process.env.ADMIN_PASSWORD || 'admin123');
    console.log('Please change the default password after first login.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
