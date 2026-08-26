const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  professorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'courses',
  timestamps: true,
});

module.exports = Course;