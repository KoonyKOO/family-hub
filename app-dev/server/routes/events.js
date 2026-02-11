const express = require('express');
const store = require('../store');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
  const { year, month } = req.query;
  let events = store.events.filter((e) => e.familyId === req.user.familyId);

  if (year && month) {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    events = events.filter((e) => e.date?.startsWith(prefix));
  }

  res.json({ events });
});

router.post('/', (req, res) => {
  const { title, description, date, time, color } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required' });
  }

  const event = {
    id: store.generateId(),
    title,
    description: description || '',
    date,
    time: time || '',
    color: color || '#3b82f6',
    familyId: req.user.familyId,
    createdBy: req.user.id,
  };

  store.events.push(event);
  res.status(201).json({ event });
});

router.put('/:id', (req, res) => {
  const event = store.events.find((e) => e.id === req.params.id && e.familyId === req.user.familyId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const { title, description, date, time, color } = req.body;
  if (title !== undefined) event.title = title;
  if (description !== undefined) event.description = description;
  if (date !== undefined) event.date = date;
  if (time !== undefined) event.time = time;
  if (color !== undefined) event.color = color;

  res.json({ event });
});

router.delete('/:id', (req, res) => {
  const idx = store.events.findIndex((e) => e.id === req.params.id && e.familyId === req.user.familyId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }

  store.events.splice(idx, 1);
  res.json({ success: true });
});

module.exports = router;
