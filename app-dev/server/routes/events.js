const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { year, month } = req.query;
    const query = { familyId: req.user.familyId };

    if (year && month) {
      const prefix = `${year}-${String(month).padStart(2, '0')}`;
      query.date = { $regex: `^${prefix}` };
    }

    const events = await Event.find(query).sort({ date: 1, time: 1 });
    res.json({ events: events.map((e) => ({ id: e._id, ...e.toObject() })) });
  } catch {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, date, time, color } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const event = await Event.create({
      title,
      description: description || '',
      date,
      time: time || '',
      color: color || '#3b82f6',
      familyId: req.user.familyId,
      createdBy: req.user._id,
    });

    res.status(201).json({ event: { id: event._id, ...event.toObject() } });
  } catch {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, familyId: req.user.familyId },
      { $set: req.body },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ event: { id: event._id, ...event.toObject() } });
  } catch {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, familyId: req.user.familyId });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
