const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{2}:\d{2}$/;
const COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;
const PRIORITIES = ['low', 'medium', 'high'];
const MAX_TITLE = 200;
const MAX_DESC = 2000;
const MAX_NAME = 100;
const MIN_PASSWORD = 6;

function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.trim();
}

function makeValidator(rules) {
  return (req, res, next) => {
    const errors = [];
    for (const { field, check, message } of rules) {
      const value = req.body[field];
      if (!check(value)) {
        errors.push(message);
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: errors[0],
        errors,
      });
    }
    next();
  };
}

const exists = (v) => v !== undefined && v !== null && String(v).trim().length > 0;
const isOptionalString = (v) => v === undefined || v === '' || typeof v === 'string';
const maxLen = (max) => (v) => !exists(v) || String(v).trim().length <= max;

const validateSignup = makeValidator([
  { field: 'name', check: exists, message: 'Name is required' },
  { field: 'name', check: maxLen(MAX_NAME), message: `Name must be ${MAX_NAME} characters or less` },
  { field: 'email', check: exists, message: 'Email is required' },
  { field: 'email', check: (v) => !exists(v) || EMAIL_REGEX.test(String(v).trim()), message: 'Invalid email format' },
  { field: 'password', check: exists, message: 'Password is required' },
  { field: 'password', check: (v) => !exists(v) || String(v).length >= MIN_PASSWORD, message: `Password must be at least ${MIN_PASSWORD} characters` },
]);

const validateLogin = makeValidator([
  { field: 'email', check: exists, message: 'Email is required' },
  { field: 'email', check: (v) => !exists(v) || EMAIL_REGEX.test(String(v).trim()), message: 'Invalid email format' },
  { field: 'password', check: exists, message: 'Password is required' },
]);

const validateEvent = makeValidator([
  { field: 'title', check: exists, message: 'Title is required' },
  { field: 'title', check: maxLen(MAX_TITLE), message: `Title must be ${MAX_TITLE} characters or less` },
  { field: 'description', check: isOptionalString, message: 'Description must be a string' },
  { field: 'description', check: maxLen(MAX_DESC), message: `Description must be ${MAX_DESC} characters or less` },
  { field: 'date', check: exists, message: 'Date is required' },
  { field: 'date', check: (v) => !exists(v) || DATE_REGEX.test(String(v).trim()), message: 'Date must be in YYYY-MM-DD format' },
  { field: 'time', check: (v) => !exists(v) || v === '' || TIME_REGEX.test(String(v).trim()), message: 'Time must be in HH:MM format' },
  { field: 'color', check: (v) => !exists(v) || v === '' || COLOR_REGEX.test(String(v).trim()), message: 'Color must be a valid hex color (e.g. #3b82f6)' },
]);

const validateEventUpdate = makeValidator([
  { field: 'title', check: (v) => !exists(v) || maxLen(MAX_TITLE)(v), message: `Title must be ${MAX_TITLE} characters or less` },
  { field: 'description', check: isOptionalString, message: 'Description must be a string' },
  { field: 'description', check: maxLen(MAX_DESC), message: `Description must be ${MAX_DESC} characters or less` },
  { field: 'date', check: (v) => !exists(v) || DATE_REGEX.test(String(v).trim()), message: 'Date must be in YYYY-MM-DD format' },
  { field: 'time', check: (v) => !exists(v) || v === '' || TIME_REGEX.test(String(v).trim()), message: 'Time must be in HH:MM format' },
  { field: 'color', check: (v) => !exists(v) || v === '' || COLOR_REGEX.test(String(v).trim()), message: 'Color must be a valid hex color (e.g. #3b82f6)' },
]);

const validateTodo = makeValidator([
  { field: 'title', check: exists, message: 'Title is required' },
  { field: 'title', check: maxLen(MAX_TITLE), message: `Title must be ${MAX_TITLE} characters or less` },
  { field: 'description', check: isOptionalString, message: 'Description must be a string' },
  { field: 'description', check: maxLen(MAX_DESC), message: `Description must be ${MAX_DESC} characters or less` },
  { field: 'priority', check: (v) => !exists(v) || PRIORITIES.includes(v), message: `Priority must be one of: ${PRIORITIES.join(', ')}` },
  { field: 'dueDate', check: (v) => !exists(v) || v === '' || DATE_REGEX.test(String(v).trim()), message: 'Due date must be in YYYY-MM-DD format' },
  { field: 'dueTime', check: (v) => !exists(v) || v === '' || TIME_REGEX.test(String(v).trim()), message: 'Due time must be in HH:MM format' },
]);

const validateTodoUpdate = makeValidator([
  { field: 'title', check: (v) => !exists(v) || maxLen(MAX_TITLE)(v), message: `Title must be ${MAX_TITLE} characters or less` },
  { field: 'description', check: isOptionalString, message: 'Description must be a string' },
  { field: 'description', check: maxLen(MAX_DESC), message: `Description must be ${MAX_DESC} characters or less` },
  { field: 'priority', check: (v) => !exists(v) || PRIORITIES.includes(v), message: `Priority must be one of: ${PRIORITIES.join(', ')}` },
  { field: 'dueDate', check: (v) => !exists(v) || v === '' || DATE_REGEX.test(String(v).trim()), message: 'Due date must be in YYYY-MM-DD format' },
  { field: 'dueTime', check: (v) => !exists(v) || v === '' || TIME_REGEX.test(String(v).trim()), message: 'Due time must be in HH:MM format' },
  { field: 'completed', check: (v) => v === undefined || typeof v === 'boolean', message: 'Completed must be a boolean' },
]);

const validateFamilyCreate = makeValidator([
  { field: 'name', check: exists, message: 'Family name is required' },
  { field: 'name', check: maxLen(MAX_NAME), message: `Family name must be ${MAX_NAME} characters or less` },
]);

const validateFamilyJoin = makeValidator([
  { field: 'inviteCode', check: exists, message: 'Invite code is required' },
  { field: 'inviteCode', check: (v) => !exists(v) || /^[A-Fa-f0-9]{6}$/.test(String(v).trim()), message: 'Invite code must be a 6-character hex string' },
]);

module.exports = {
  sanitize,
  validateSignup,
  validateLogin,
  validateEvent,
  validateEventUpdate,
  validateTodo,
  validateTodoUpdate,
  validateFamilyCreate,
  validateFamilyJoin,
};
