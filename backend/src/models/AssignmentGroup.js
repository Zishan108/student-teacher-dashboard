const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AssignmentGroup = sequelize.define('AssignmentGroup', {
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
    allowNull: false,
  },
}, {
  tableName: 'assignment_groups',
  timestamps: true,
});

module.exports = AssignmentGroup;