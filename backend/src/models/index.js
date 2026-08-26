const User = require('./User');
const Group = require('./Group');
const GroupMember = require('./GroupMember');
const Assignment = require('./Assignment');
const AssignmentGroup = require('./AssignmentGroup');
const Submission = require('./Submission');
const Course = require('./Course');
const CourseEnrollment = require('./CourseEnrollment');

// User <-> Group (creator, leader)
User.hasMany(Group, { foreignKey: 'createdBy', as: 'createdGroups' });
Group.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Group, { foreignKey: 'leaderId', as: 'ledGroups' });
Group.belongsTo(User, { foreignKey: 'leaderId', as: 'leader' });

// Group <-> User (members, via GroupMember)
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'groupId', otherKey: 'userId', as: 'members' });
User.belongsToMany(Group, { through: GroupMember, foreignKey: 'userId', otherKey: 'groupId', as: 'groups' });

GroupMember.belongsTo(Group, { foreignKey: 'groupId' });
GroupMember.belongsTo(User, { foreignKey: 'userId' });

// User <-> Assignment (creator/admin)
User.hasMany(Assignment, { foreignKey: 'createdBy', as: 'createdAssignments' });
Assignment.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Assignment <-> Group (via AssignmentGroup, for targeted assignments)
Assignment.belongsToMany(Group, { through: AssignmentGroup, foreignKey: 'assignmentId', otherKey: 'groupId', as: 'targetGroups' });
Group.belongsToMany(Assignment, { through: AssignmentGroup, foreignKey: 'groupId', otherKey: 'assignmentId', as: 'assignments' });

// Submission relations
Assignment.hasMany(Submission, { foreignKey: 'assignmentId', as: 'submissions' });
Submission.belongsTo(Assignment, { foreignKey: 'assignmentId' });

Group.hasMany(Submission, { foreignKey: 'groupId', as: 'submissions' });
Submission.belongsTo(Group, { foreignKey: 'groupId' });

User.hasMany(Submission, { foreignKey: 'confirmedBy', as: 'confirmedSubmissions' });
Submission.belongsTo(User, { foreignKey: 'confirmedBy', as: 'confirmer' });

User.hasMany(Submission, { foreignKey: 'studentId', as: 'individualSubmissions' });
Submission.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// Course relations
User.hasMany(Course, { foreignKey: 'professorId', as: 'taughtCourses' });
Course.belongsTo(User, { foreignKey: 'professorId', as: 'professor' });

Course.belongsToMany(User, { through: CourseEnrollment, foreignKey: 'courseId', otherKey: 'studentId', as: 'students' });
User.belongsToMany(Course, { through: CourseEnrollment, foreignKey: 'studentId', otherKey: 'courseId', as: 'enrolledCourses' });

Course.hasMany(Group, { foreignKey: 'courseId', as: 'groups' });
Group.belongsTo(Course, { foreignKey: 'courseId' });

Course.hasMany(Assignment, { foreignKey: 'courseId', as: 'assignments' });
Assignment.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = {
  User,
  Group,
  GroupMember,
  Assignment,
  AssignmentGroup,
  Submission,
  Course,
  CourseEnrollment,
};