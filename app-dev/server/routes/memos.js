const express = require('express');
const Memo = require('../models/Memo');
const auth = require('../middleware/auth');
const { notifyFamily } = require('../lib/pushService');

const router = express.Router();

router.use(auth);

const ownerQuery = (user) =>
  user.familyId ? { familyId: user.familyId } : { createdBy: user._id };

router.get('/', async (req, res) => {
  try {
    const memos = await Memo.find(ownerQuery(req.user))
      .sort({ pinned: -1, createdAt: -1 })
      .populate('createdBy', 'name');
    res.json({ memos: memos.map((m) => ({ id: m._id, ...m.toObject() })) });
  } catch {
    res.status(500).json({ error: 'Failed to fetch memos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { content, color } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const memo = await Memo.create({
      content,
      color: color || '#fef3c7',
      familyId: req.user.familyId || null,
      createdBy: req.user._id,
    });

    const populated = await memo.populate('createdBy', 'name');

    if (req.user.familyId) {
      await notifyFamily(req.user.familyId, {
        title: 'Family Hub',
        body: `${req.user.name}님이 새 메모를 남겼습니다`,
        url: '/',
      }).catch(() => {});
    }

    res.status(201).json({ memo: { id: populated._id, ...populated.toObject() } });
  } catch {
    res.status(500).json({ error: 'Failed to create memo' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const memo = await Memo.findOneAndUpdate(
      { _id: req.params.id, ...ownerQuery(req.user) },
      { $set: req.body },
      { new: true }
    ).populate('createdBy', 'name');

    if (!memo) {
      return res.status(404).json({ error: 'Memo not found' });
    }

    res.json({ memo: { id: memo._id, ...memo.toObject() } });
  } catch {
    res.status(500).json({ error: 'Failed to update memo' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const memo = await Memo.findOneAndDelete({ _id: req.params.id, ...ownerQuery(req.user) });

    if (!memo) {
      return res.status(404).json({ error: 'Memo not found' });
    }

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete memo' });
  }
});

module.exports = router;
