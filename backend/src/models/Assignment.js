const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  onedriveLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  target: {
    type: DataTypes.ENUM('all', 'group'),
    allowNull: false,
    defaultValue: 'all',
  },
  submissionType: {
    type: DataTypes.ENUM('individual', 'group'),
    allowNull: false,
    defaultValue: 'group',
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'assignments',
  timestamps: true,
});

module.exports = Assignment;