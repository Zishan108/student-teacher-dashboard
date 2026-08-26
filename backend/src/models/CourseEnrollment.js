const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CourseEnrollment = sequelize.define('CourseEnrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'course_enrollments',
  timestamps: true,
});

module.exports = CourseEnrollment;