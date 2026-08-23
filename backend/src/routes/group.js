const express = require('express');
const { Group, GroupMember, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Create a group (student creates, becomes first member automatically)
router.post('/', authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Group name is required' });

    const group = await Group.create({
      name,
      createdBy: req.user.id,
    });

    await GroupMember.create({
      groupId: group.id,
      userId: req.user.id,
    });

    res.status(201).json({ group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Add a member to a group (by email)
router.post('/:id/members', authenticate, async (req, res) => {
  try {
    const { email } = req.body;
    const groupId = req.params.id;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const userToAdd = await User.findOne({ where: { email } });
    if (!userToAdd) return res.status(404).json({ error: 'No user found with that email' });

    const alreadyMember = await GroupMember.findOne({
      where: { groupId, userId: userToAdd.id },
    });
    if (alreadyMember) return res.status(409).json({ error: 'User is already a member of this group' });

    await GroupMember.create({ groupId, userId: userToAdd.id });

    res.status(201).json({ message: 'Member added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all groups (admin only) — used to target assignments to specific groups
router.get('/all', authenticate, authorize('admin'), async (req, res) => {
  try {
    const groups = await Group.findAll({
      include: [{ model: User, as: 'members', attributes: ['id', 'name', 'email'] }],
      order: [['name', 'ASC']],
    });
    res.json({ groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get a single group with its members
router.get('/:id', authenticate, async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [{ model: User, as: 'members', attributes: ['id', 'name', 'email'] }],
    });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    res.json({ group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all groups the logged-in user belongs to
// Get all groups the logged-in user belongs to
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Group,
          as: 'groups',
          include: [{ model: User, as: 'members', attributes: ['id', 'name', 'email'] }],
        },
      ],
    });
    res.json({ groups: user.groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;