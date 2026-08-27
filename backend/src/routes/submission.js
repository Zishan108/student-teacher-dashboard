const express = require('express');
const { Submission, Assignment, Group, GroupMember, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Step 1: "Yes, I have submitted" (student, must be a member of the group)
// Step 1: "Yes, I have submitted"
router.post('/:id/step1', authenticate, async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id, {
      include: [{ model: Group }],
    });
    if (!submission) return res.status(404).json({ error: 'Submission not found' });

    if (submission.status === 'confirmed') {
      return res.status(400).json({ error: 'Already fully confirmed' });
    }

    if (submission.groupId) {
      // Group submission — only the leader can act
      const group = submission.Group;
      if (group.leaderId !== req.user.id) {
        return res.status(403).json({ error: 'Only the group leader can confirm this submission' });
      }
    } else {
      // Individual submission — only the assigned student can act
      if (submission.studentId !== req.user.id) {
        return res.status(403).json({ error: 'This submission does not belong to you' });
      }
    }

    await submission.update({ status: 'step1_confirmed' });
    res.json({ message: 'Step 1 confirmed. Please confirm again to finalize.', submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Step 2: Final confirm
router.post('/:id/confirm', authenticate, async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id, {
      include: [{ model: Group }],
    });
    if (!submission) return res.status(404).json({ error: 'Submission not found' });

    if (submission.status !== 'step1_confirmed') {
      return res.status(400).json({ error: 'Please complete step 1 first' });
    }

    if (submission.groupId) {
      const group = submission.Group;
      if (group.leaderId !== req.user.id) {
        return res.status(403).json({ error: 'Only the group leader can confirm this submission' });
      }
    } else {
      if (submission.studentId !== req.user.id) {
        return res.status(403).json({ error: 'This submission does not belong to you' });
      }
    }

    await submission.update({
      status: 'confirmed',
      confirmedBy: req.user.id,
      confirmedAt: new Date(),
    });

    res.json({ message: 'Submission confirmed successfully', submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all submissions for a specific group (progress tracking)
router.get('/group/:groupId', authenticate, async (req, res) => {
  try {
    const submissions = await Submission.findAll({
      where: { groupId: req.params.groupId },
      include: [{ model: Assignment, attributes: ['id', 'title', 'dueDate'] }],
    });
    res.json({ submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all submissions for a specific assignment (admin tracking)
// Get all submissions for a specific assignment (admin tracking)
router.get('/assignment/:assignmentId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const submissions = await Submission.findAll({
      where: { assignmentId: req.params.assignmentId },
      include: [
        {
          model: Group,
          attributes: ['id', 'name'],
          include: [{ model: User, as: 'members', attributes: ['id', 'name', 'email'] }],
        },
        { model: User, as: 'confirmer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
      ],
    });
    res.json({ submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Analytics (admin only) - completion counts per assignment
router.get('/analytics', authenticate, authorize('admin'), async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [{ model: Submission, as: 'submissions' }],
    });

    const analytics = assignments.map((a) => {
      const total = a.submissions.length;
      const confirmed = a.submissions.filter((s) => s.status === 'confirmed').length;
      const pending = total - confirmed;
      return {
        assignmentId: a.id,
        title: a.title,
        totalGroups: total,
        confirmed,
        pending,
        completionRate: total > 0 ? Math.round((confirmed / total) * 100) : 0,
      };
    });

    res.json({ analytics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all individual submissions for the logged-in student
router.get('/mine', authenticate, async (req, res) => {
  try {
    const submissions = await Submission.findAll({
      where: { studentId: req.user.id },
      include: [{ model: Assignment }],
    });
    res.json({ submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;