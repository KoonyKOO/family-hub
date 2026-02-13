const express = require('express');
const crypto = require('crypto');
const Family = require('../models/Family');
const User = require('../models/User');
const PushSubscription = require('../models/PushSubscription');
const auth = require('../middleware/auth');
const { validateFamilyCreate, validateFamilyJoin } = require('../middleware/validate');
const { success, error } = require('../lib/response');

const router = express.Router();

router.use(auth);

const generateInviteCode = () => crypto.randomBytes(3).toString('hex').toUpperCase();

router.get('/', async (req, res) => {
  try {
    if (!req.user.familyId) {
      return error(res, '가족 그룹이 없습니다.', 404);
    }

    const family = await Family.findById(req.user.familyId);
    if (!family) {
      return error(res, '가족 정보를 찾을 수 없습니다.', 404);
    }

    const members = await User.find({ familyId: family._id }).select('-password');
    const safeMembers = members.map((m) => ({ id: m._id, name: m.name, email: m.email, familyId: m.familyId }));

    return success(res, { family: { id: family._id, name: family.name, inviteCode: family.inviteCode }, members: safeMembers });
  } catch {
    return error(res, '가족 정보를 불러오는데 실패했습니다.');
  }
});

router.post('/', validateFamilyCreate, async (req, res) => {
  try {
    const { name } = req.body;

    if (req.user.familyId) {
      return error(res, '이미 가족 그룹에 속해 있습니다.', 400);
    }

    const family = await Family.create({
      name,
      inviteCode: generateInviteCode(),
      createdBy: req.user._id,
    });

    req.user.familyId = family._id;
    await req.user.save();
    await PushSubscription.updateMany({ userId: req.user._id }, { familyId: family._id });

    const members = [{ id: req.user._id, name: req.user.name, email: req.user.email, familyId: family._id }];
    return success(res, { family: { id: family._id, name: family.name, inviteCode: family.inviteCode }, members }, 201);
  } catch {
    return error(res, '가족 그룹 생성에 실패했습니다.');
  }
});

router.post('/join', validateFamilyJoin, async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (req.user.familyId) {
      return error(res, '이미 가족 그룹에 속해 있습니다.', 400);
    }

    const family = await Family.findOne({ inviteCode });
    if (!family) {
      return error(res, '유효하지 않은 초대 코드입니다.', 404);
    }

    req.user.familyId = family._id;
    await req.user.save();
    await PushSubscription.updateMany({ userId: req.user._id }, { familyId: family._id });

    const members = await User.find({ familyId: family._id }).select('-password');
    const safeMembers = members.map((m) => ({ id: m._id, name: m.name, email: m.email, familyId: m.familyId }));

    return success(res, { family: { id: family._id, name: family.name, inviteCode: family.inviteCode }, members: safeMembers });
  } catch {
    return error(res, '가족 그룹 참여에 실패했습니다.');
  }
});

router.post('/leave', async (req, res) => {
  try {
    if (!req.user.familyId) {
      return error(res, '가족 그룹에 속해 있지 않습니다.', 400);
    }

    req.user.familyId = null;
    await req.user.save();
    await PushSubscription.updateMany({ userId: req.user._id }, { familyId: null });
    return success(res);
  } catch {
    return error(res, '가족 그룹 탈퇴에 실패했습니다.');
  }
});

module.exports = router;
