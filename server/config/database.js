const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

// Common configuration
const commonConfig = {
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  }
};

// Development configuration (SQLite)
const developmentConfig = {
  ...commonConfig,
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: console.log
};

// Production configuration (PostgreSQL)
const productionConfig = {
  ...commonConfig,
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
};

// Determine which configuration to use
if (process.env.DATABASE_URL) {
  // Use PostgreSQL if DATABASE_URL is provided (Render provides this)
  sequelize = new Sequelize(process.env.DATABASE_URL, productionConfig);
} else if (process.env.NODE_ENV === 'production') {
  throw new Error('DATABASE_URL is required in production environment');
} else {
  // Use SQLite for development
  sequelize = new Sequelize(developmentConfig);
}

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = { sequelize };
