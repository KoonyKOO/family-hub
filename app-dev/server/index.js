const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { validateEnv } = require('./config');
const rateLimit = require('./middleware/rateLimit');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const todoRoutes = require('./routes/todos');
const familyRoutes = require('./routes/family');
const pushRoutes = require('./routes/push');

validateEnv();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ success: false, error: '서버 연결에 실패했습니다.' });
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: '로그인 시도가 너무 많습니다. 15분 후에 다시 시도해주세요.',
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/events', apiLimiter, eventRoutes);
app.use('/api/todos', apiLimiter, todoRoutes);
app.use('/api/family', apiLimiter, familyRoutes);
app.use('/api/push', apiLimiter, pushRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
