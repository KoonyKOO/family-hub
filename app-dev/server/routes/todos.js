const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ familyId: req.user.familyId }).sort({ createdAt: -1 });
    res.json({ todos: todos.map((t) => ({ id: t._id, ...t.toObject() })) });
  } catch {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todo = await Todo.create({
      title,
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate || '',
      familyId: req.user.familyId,
      createdBy: req.user._id,
    });

    res.status(201).json({ todo: { id: todo._id, ...todo.toObject() } });
  } catch {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, familyId: req.user.familyId },
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
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, familyId: req.user.familyId });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;
