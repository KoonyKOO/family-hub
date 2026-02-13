const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getJwtSecret } = require('../config');
const { validateSignup, validateLogin } = require('../middleware/validate');
const { success, error } = require('../lib/response');

const router = express.Router();

const signToken = (userId) =>
  jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: '7d' });

router.post('/signup', validateSignup, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return error(res, '이미 등록된 이메일입니다.', 400);
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    const safeUser = { id: user._id, name: user.name, email: user.email, familyId: user.familyId };
    return success(res, { user: safeUser, token }, 201);
  } catch (err) {
    return error(res, '회원가입에 실패했습니다. 다시 시도해주세요.');
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return error(res, '이메일 또는 비밀번호가 올바르지 않습니다.', 401);
    }

    const token = signToken(user._id);
    const safeUser = { id: user._id, name: user.name, email: user.email, familyId: user.familyId };
    return success(res, { user: safeUser, token });
  } catch (err) {
    return error(res, '로그인에 실패했습니다. 다시 시도해주세요.');
  }
});

module.exports = router;
