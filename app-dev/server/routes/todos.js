const express = require('express');
const store = require('../store');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
  const todos = store.todos.filter((t) => t.familyId === req.user.familyId);
  res.json({ todos });
});

router.post('/', (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const todo = {
    id: store.generateId(),
    title,
    description: description || '',
    priority: priority || 'medium',
    dueDate: dueDate || '',
    completed: false,
    familyId: req.user.familyId,
    createdBy: req.user.id,
  };

  store.todos.push(todo);
  res.status(201).json({ todo });
});

router.put('/:id', (req, res) => {
  const todo = store.todos.find((t) => t.id === req.params.id && t.familyId === req.user.familyId);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const { title, description, priority, dueDate, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (priority !== undefined) todo.priority = priority;
  if (dueDate !== undefined) todo.dueDate = dueDate;
  if (completed !== undefined) todo.completed = completed;

  res.json({ todo });
});

router.delete('/:id', (req, res) => {
  const idx = store.todos.findIndex((t) => t.id === req.params.id && t.familyId === req.user.familyId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  store.todos.splice(idx, 1);
  res.json({ success: true });
});

module.exports = router;
