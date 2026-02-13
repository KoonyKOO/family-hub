const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const { validateEvent, validateEventUpdate } = require('../middleware/validate');
const { notifyFamily } = require('../lib/pushService');

const router = express.Router();

router.use(auth);

const ownerQuery = (user) =>
  user.familyId ? { familyId: user.familyId } : { createdBy: user._id };

router.get('/', async (req, res) => {
  try {
    const { year, month } = req.query;
    const query = ownerQuery(req.user);

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

router.post('/', validateEvent, async (req, res) => {
  try {
    const { title, description, date, time, color } = req.body;

    const event = await Event.create({
      title,
      description: description || '',
      date,
      time: time || '',
      color: color || '#3b82f6',
      familyId: req.user.familyId || null,
      createdBy: req.user._id,
    });

    if (req.user.familyId) {
      await notifyFamily(req.user.familyId, {
        title: 'Family Hub',
        body: `${req.user.name}님이 '${title}' 일정을 ${date}에 추가했습니다`,
        url: '/',
      }).catch(() => {});
    }

    res.status(201).json({ event: { id: event._id, ...event.toObject() } });
  } catch {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

const EVENT_UPDATABLE_FIELDS = ['title', 'description', 'date', 'time', 'color'];

router.put('/:id', validateEventUpdate, async (req, res) => {
  try {
    const updates = {};
    for (const field of EVENT_UPDATABLE_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, ...ownerQuery(req.user) },
      { $set: updates },
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
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const isOwner = event.createdBy.toString() === req.user._id.toString();
    const isFamilyMember = req.user.familyId && event.familyId &&
      req.user.familyId.toString() === event.familyId.toString();

    if (!isOwner && !isFamilyMember) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
