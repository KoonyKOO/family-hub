const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const { validateEvent, validateEventUpdate } = require('../middleware/validate');
const { notifyFamily } = require('../lib/pushService');
const { success, error } = require('../lib/response');

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
    return success(res, { events: events.map((e) => ({ id: e._id, ...e.toObject() })) });
  } catch {
    return error(res, '일정을 불러오는데 실패했습니다.');
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
        channel: 'events:changed',
      }).catch(() => {});
    }

    return success(res, { event: { id: event._id, ...event.toObject() } }, 201);
  } catch {
    return error(res, '일정 추가에 실패했습니다.');
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
      return error(res, '일정을 찾을 수 없습니다.', 404);
    }

    if (req.user.familyId) {
      await notifyFamily(req.user.familyId, {
        title: 'Family Hub',
        body: `${req.user.name}님이 '${event.title}' 일정을 수정했습니다`,
        url: '/',
        channel: 'events:changed',
      }).catch(() => {});
    }

    return success(res, { event: { id: event._id, ...event.toObject() } });
  } catch {
    return error(res, '일정 수정에 실패했습니다.');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return error(res, '일정을 찾을 수 없습니다.', 404);
    }

    const isOwner = event.createdBy.toString() === req.user._id.toString();
    const isFamilyMember = req.user.familyId && event.familyId &&
      req.user.familyId.toString() === event.familyId.toString();

    if (!isOwner && !isFamilyMember) {
      return error(res, '이 일정을 삭제할 권한이 없습니다.', 403);
    }

    await Event.findByIdAndDelete(req.params.id);

    if (req.user.familyId) {
      await notifyFamily(req.user.familyId, {
        title: 'Family Hub',
        body: `${req.user.name}님이 '${event.title}' 일정을 삭제했습니다`,
        url: '/',
        channel: 'events:changed',
      }).catch(() => {});
    }

    return success(res);
  } catch {
    return error(res, '일정 삭제에 실패했습니다.');
  }
});

module.exports = router;
