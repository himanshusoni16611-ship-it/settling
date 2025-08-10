// server/models/Balance.js
const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  fparty: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  sumDebit: { type: String }, // or Number if already numeric
  sumCredit: { type: String }
});

module.exports = mongoose.model('Balance', balanceSchema);
