const store = {
  users: [],
  families: [],
  events: [],
  todos: [],
  nextId: 1,
};

store.generateId = () => String(store.nextId++);

store.generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

module.exports = store;
