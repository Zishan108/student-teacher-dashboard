const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  assignmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: true, // null for individual submissions
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: true, // null for group submissions
  },
  status: {
    type: DataTypes.ENUM('pending', 'step1_confirmed', 'confirmed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  confirmedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  confirmedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'submissions',
  timestamps: true,
});

module.exports = Submission;