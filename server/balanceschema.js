const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  fparty: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },
  sumDebit: { type: Number, default: 0 },
  sumCredit: { type: Number, default: 0 },
  tally: { type: Number, default: 0 }
});

module.exports = mongoose.model('Balance', balanceSchema);
