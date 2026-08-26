const express = require('express');
const { Course, User, Group, Assignment } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Create a course (professor only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Course name is required' });

    const course = await Course.create({
      name,
      description,
      professorId: req.user.id,
    });

    res.status(201).json({ course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Enroll a student in a course (professor only, by student email)
router.post('/:id/enroll', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { email } = req.body;
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const student = await User.findOne({ where: { email, role: 'student' } });
    if (!student) return res.status(404).json({ error: 'No student found with that email' });

    await course.addStudent(student); // Sequelize magic method from belongsToMany
    res.status(201).json({ message: 'Student enrolled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get courses taught by the logged-in professor
router.get('/taught', authenticate, authorize('admin'), async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { professorId: req.user.id },
      include: [{ model: User, as: 'students', attributes: ['id', 'name', 'email'] }],
    });
    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get courses the logged-in student is enrolled in
router.get('/enrolled', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Course, as: 'enrolledCourses' }],
    });
    res.json({ courses: user.enrolledCourses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all courses (admin only — used when creating a group tied to a course)
router.get('/all', authenticate, async (req, res) => {
  try {
    const courses = await Course.findAll({ order: [['name', 'ASC']] });
    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get a single course (with assignments + groups)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: Assignment, as: 'assignments' },
        { model: Group, as: 'groups' },
        { model: User, as: 'students', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'professor', attributes: ['id', 'name', 'email'] },
      ],
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;