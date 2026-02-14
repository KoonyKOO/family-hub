const mongoose = require('mongoose');

const memoSchema = new mongoose.Schema({
  content: { type: String, required: true },
  pinned: { type: Boolean, default: false },
  color: { type: String, default: '#fef3c7' },
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.models.Memo || mongoose.model('Memo', memoSchema);
