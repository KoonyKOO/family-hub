const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');
const { validateTodo, validateTodoUpdate } = require('../middleware/validate');
const { notifyFamily } = require('../lib/pushService');
const { success, error } = require('../lib/response');

const router = express.Router();

router.use(auth);

const ownerQuery = (user) =>
  user.familyId ? { familyId: user.familyId } : { createdBy: user._id };

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find(ownerQuery(req.user)).sort({ createdAt: -1 });
    return success(res, { todos: todos.map((t) => ({ id: t._id, ...t.toObject() })) });
  } catch {
    return error(res, '할일을 불러오는데 실패했습니다.');
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
        channel: 'todos:changed',
      }).catch(() => {});
    }

    return success(res, { todo: { id: todo._id, ...todo.toObject() } }, 201);
  } catch {
    return error(res, '할일 추가에 실패했습니다.');
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
      return error(res, '할일을 찾을 수 없습니다.', 404);
    }

    if (req.user.familyId) {
      await notifyFamily(req.user.familyId, {
        title: 'Family Hub',
        body: `${req.user.name}님이 '${todo.title}' 할일을 수정했습니다`,
        url: '/',
        channel: 'todos:changed',
      }).catch(() => {});
    }

    return success(res, { todo: { id: todo._id, ...todo.toObject() } });
  } catch {
    return error(res, '할일 수정에 실패했습니다.');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return error(res, '할일을 찾을 수 없습니다.', 404);
    }

    const isOwner = todo.createdBy.toString() === req.user._id.toString();
    const isFamilyMember = req.user.familyId && todo.familyId &&
      req.user.familyId.toString() === todo.familyId.toString();

    if (!isOwner && !isFamilyMember) {
      return error(res, '이 할일을 삭제할 권한이 없습니다.', 403);
    }

    await Todo.findByIdAndDelete(req.params.id);

    if (req.user.familyId) {
      await notifyFamily(req.user.familyId, {
        title: 'Family Hub',
        body: `${req.user.name}님이 '${todo.title}' 할일을 삭제했습니다`,
        url: '/',
        channel: 'todos:changed',
      }).catch(() => {});
    }

    return success(res);
  } catch {
    return error(res, '할일 삭제에 실패했습니다.');
  }
});

module.exports = router;
