const express = require('express');
const { Assignment, AssignmentGroup, Group, Submission } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Create assignment (admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, description, dueDate, onedriveLink, target, groupIds } = req.body;

    if (!title || !dueDate || !onedriveLink) {
      return res.status(400).json({ error: 'Title, dueDate, and onedriveLink are required' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      onedriveLink,
      target: target === 'group' ? 'group' : 'all',
      createdBy: req.user.id,
    });

    // If targeting specific groups, link them + create pending submissions
    let targetGroups = [];
    if (target === 'group' && Array.isArray(groupIds) && groupIds.length > 0) {
      for (const groupId of groupIds) {
        await AssignmentGroup.create({ assignmentId: assignment.id, groupId });
        await Submission.create({ assignmentId: assignment.id, groupId, status: 'pending' });
      }
      targetGroups = groupIds;
    } else {
      // target = 'all' -> create a pending submission for every existing group
      const allGroups = await Group.findAll();
      for (const g of allGroups) {
        await Submission.create({ assignmentId: assignment.id, groupId: g.id, status: 'pending' });
      }
    }

    res.status(201).json({ assignment, targetGroups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Edit assignment (admin only)
router.patch('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    const { title, description, dueDate, onedriveLink } = req.body;
    await assignment.update({
      title: title ?? assignment.title,
      description: description ?? assignment.description,
      dueDate: dueDate ?? assignment.dueDate,
      onedriveLink: onedriveLink ?? assignment.onedriveLink,
    });

    res.json({ assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all assignments (both roles can view)
router.get('/', authenticate, async (req, res) => {
  try {
    const assignments = await Assignment.findAll({ order: [['dueDate', 'ASC']] });
    res.json({ assignments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get single assignment
router.get('/:id', authenticate, async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json({ assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Delete assignment (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    await Submission.destroy({ where: { assignmentId: assignment.id } });
    await AssignmentGroup.destroy({ where: { assignmentId: assignment.id } });
    await assignment.destroy();

    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;