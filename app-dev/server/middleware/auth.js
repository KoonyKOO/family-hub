const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getJwtSecret } = require('../config');
const { error } = require('../lib/response');

const auth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return error(res, '로그인이 필요합니다.', 401);
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id);
    if (!user) {
      return error(res, '사용자를 찾을 수 없습니다.', 401);
    }
    req.user = user;
    next();
  } catch {
    return error(res, '인증이 만료되었습니다. 다시 로그인해주세요.', 401);
  }
};

module.exports = auth;
