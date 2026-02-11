const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: String, required: true },
  time: { type: String, default: '' },
  color: { type: String, default: '#3b82f6' },
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);
