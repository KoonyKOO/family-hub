const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');
const { notifyFamily } = require('../lib/pushService');

const router = express.Router();

router.use(auth);

const ownerQuery = (user) =>
  user.familyId ? { familyId: user.familyId } : { createdBy: user._id };

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find(ownerQuery(req.user)).sort({ createdAt: -1 });
    res.json({ todos: todos.map((t) => ({ id: t._id, ...t.toObject() })) });
  } catch {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate, dueTime } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todo = await Todo.create({
      title,
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate || '',
      dueTime: dueTime || '',
      familyId: req.user.familyId || null,
      createdBy: req.user._id,
    });

    if (req.user.familyId) {
      await notifyFamily(req.user.familyId, {
        title: 'Family Hub',
        body: `${req.user.name}님이 '${title}' 할일을 추가했습니다`,
        url: '/',
      }).catch(() => {});
    }

    res.status(201).json({ todo: { id: todo._id, ...todo.toObject() } });
  } catch {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, ...ownerQuery(req.user) },
      { $set: req.body },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ todo: { id: todo._id, ...todo.toObject() } });
  } catch {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, ...ownerQuery(req.user) });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;
