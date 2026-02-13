const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');
const { validateTodo, validateTodoUpdate } = require('../middleware/validate');
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

router.post('/', validateTodo, async (req, res) => {
  try {
    const { title, description, priority, dueDate, dueTime } = req.body;

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

const TODO_UPDATABLE_FIELDS = ['title', 'description', 'priority', 'dueDate', 'dueTime', 'completed'];

router.put('/:id', validateTodoUpdate, async (req, res) => {
  try {
    const updates = {};
    for (const field of TODO_UPDATABLE_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, ...ownerQuery(req.user) },
      { $set: updates },
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
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const isOwner = todo.createdBy.toString() === req.user._id.toString();
    const isFamilyMember = req.user.familyId && todo.familyId &&
      req.user.familyId.toString() === todo.familyId.toString();

    if (!isOwner && !isFamilyMember) {
      return res.status(403).json({ error: 'Not authorized to delete this todo' });
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;
