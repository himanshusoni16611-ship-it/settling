const mongoose = require('mongoose');

const settSchema = new mongoose.Schema({
  txtnId: { type: String, required: true },
  date: { type: String, required: true },
  fparty: { type: String, required: true },
  sparty: { type: String, required: true },
  debit: { type: Number },
  credit: { type: Number },
  narration: { type: String },
  tally: { type: String, default: "" },
  created: { type: Date, default: Date.now }
});

settSchema.index({ date: 1 });

module.exports = mongoose.models.Settling || mongoose.model('Settling', sett_schema);
