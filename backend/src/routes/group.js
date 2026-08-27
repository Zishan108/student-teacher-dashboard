const express = require('express');
const { Group, GroupMember, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Create a group (student creates, becomes first member automatically)
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, courseId } = req.body;
    if (!name) return res.status(400).json({ error: 'Group name is required' });

    const group = await Group.create({
      name,
      createdBy: req.user.id,
      leaderId: req.user.id, // creator is leader by default
      courseId: courseId || null,
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
      include: [
        { model: User, as: 'members', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'leader', attributes: ['id', 'name', 'email'] },
      ],
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
          include: [
            { model: User, as: 'members', attributes: ['id', 'name', 'email'] },
            { model: User, as: 'leader', attributes: ['id', 'name', 'email'] },
          ],
        },
      ],
    });
    res.json({ groups: user.groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Remove a member from a group
router.delete('/:id/members/:userId', authenticate, async (req, res) => {
  try {
    const { id: groupId, userId } = req.params;
    const targetUserId = Number(userId);

    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const requesterMembership = await GroupMember.findOne({
      where: { groupId, userId: req.user.id },
    });
    if (!requesterMembership) {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }

    const isSelfRemoval = req.user.id === targetUserId;
    const isLeader = group.leaderId === req.user.id;

    // Only the leader can remove someone else. Anyone can remove themselves (leave).
    if (!isSelfRemoval && !isLeader) {
      return res.status(403).json({ error: 'Only the group leader can remove other members' });
    }

    const targetMembership = await GroupMember.findOne({ where: { groupId, userId: targetUserId } });
    if (!targetMembership) {
      return res.status(404).json({ error: 'Member not found in this group' });
    }

    await targetMembership.destroy();

    // If the leader was just removed, auto-promote the earliest-remaining member.
    if (group.leaderId === targetUserId) {
      const remaining = await GroupMember.findOne({
        where: { groupId },
        order: [['createdAt', 'ASC']],
      });
      if (remaining) {
        await group.update({ leaderId: remaining.userId });
      }
      // If no members remain, leaderId is left pointing at someone no longer in
      // the group — harmless since there's nobody to act on submissions anyway.
    }

    res.json({ message: 'Member removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Transfer group leadership to another member (current leader only)
router.patch('/:id/leader', authenticate, async (req, res) => {
  try {
    const { newLeaderId } = req.body;
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (group.leaderId !== req.user.id) {
      return res.status(403).json({ error: 'Only the current leader can transfer leadership' });
    }

    const isMember = await GroupMember.findOne({ where: { groupId: group.id, userId: newLeaderId } });
    if (!isMember) return res.status(400).json({ error: 'New leader must be a member of this group' });

    await group.update({ leaderId: newLeaderId });
    res.json({ message: 'Leadership transferred', group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;