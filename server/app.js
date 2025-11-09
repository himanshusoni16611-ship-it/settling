// server/app.js

// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Import MongoDB connection and schemas
const db = require('./db'); // make sure this connects to your MongoDB
const Party = require('./schema');
const Sett = require('./settschema');
const Balance = require('./balanceschema');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: [
    'http://setling.in',
    'https://setling.in',
    'http://www.setling.in',
    'https://www.setling.in',
    'http://localhost:3000'
  ]
}));

// Serve frontend build folder
const buildpath = path.join(__dirname, '..', 'build');
if (fs.existsSync(buildpath)) {
  console.log('Build folder exists:', buildpath);
} else {
  console.log('Build folder NOT found:', buildpath);
}
app.use(express.static(buildpath));

// ------------------- API Routes -------------------

// Add party
app.post('/api/partyadd', async (req, res) => {
  try {
    const data = req.body;
    const existing_party = await Party.findOne({ pnm: data.pnm });
    if (existing_party) return res.status(400).json({ error: 'Party already exists' });

    const nparty = new Party(data);
    const saved = await nparty.save();
    res.status(201).json({ message: 'Data saved successfully', data: saved });
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all parties
app.get('/api/partyadd', async (req, res) => {
  try {
    const parties = await Party.find({}).sort({ pnm: 1 });
    res.json(parties);
  } catch (err) {
    console.error('Error fetching parties:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete party
app.delete('/api/partyadd/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const party = await Party.findById(id);
    if (!party) return res.status(404).json({ error: 'Party not found' });

    const entries = await Sett.find({ fparty: party.pnm });
    const totalDebit = entries.reduce((sum, e) => sum + (e.debit || 0), 0);
    const totalCredit = entries.reduce((sum, e) => sum + (e.credit || 0), 0);
    if (totalDebit - totalCredit !== 0) return res.status(400).json({ error: 'Cannot delete party. Balance is not zero' });

    await Party.findByIdAndDelete(id);
    res.json({ message: 'Party deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Add cross-entry (settling)
app.post('/api/settlingentry', async (req, res) => {
  try {
    const { date, fparty, sparty, debit, credit, narration, tally } = req.body;
    if (!fparty || !sparty) return res.status(400).json({ message: 'Both fparty and sparty are required.' });

    const txtnId = Date.now();
    const entries = [
      { txtnId, date, fparty, sparty, debit, credit, narration, tally },
      { txtnId, date, fparty: sparty, sparty: fparty, debit: credit, credit: debit, narration, tally }
    ];

    const savedEntry = await Sett.insertMany(entries);
    const latest = savedEntry.find(e => e.fparty === fparty);

    res.status(201).json({ message: 'Entries saved', data: savedEntry, latestId: latest?._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get entries by fparty
app.get('/api/settlingentry', async (req, res) => {
  try {
    const { fparty } = req.query;
    if (!fparty) return res.status(400).json({ message: 'fparty is required' });

    const results = await Sett.find({ fparty }).select('date sparty debit credit narration txtnId tally').sort({ date: 1, sparty: 1 });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete entries by txtnId
app.delete('/api/settlingentry/:txtnId', async (req, res) => {
  try {
    const { txtnId } = req.params;
    const deleted = await Sett.deleteMany({ txtnId });
    res.status(200).json({ message: 'Deleted successfully', txtnId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update entry
app.put('/api/settlingentry/:up_id', async (req, res) => {
  try {
    const { up_id } = req.params;
    const { fparty, sparty, date, debit, credit, narration } = req.body;

    const original = await Sett.findById(up_id);
    if (!original) return res.status(404).json({ message: 'Entry not found' });
    const { txtnId } = original;

    const update1 = await Sett.findByIdAndUpdate(up_id, { fparty, sparty, date, debit, credit, narration }, { new: true });
    const update2 = await Sett.findOneAndUpdate({ txtnId, fparty: sparty, sparty: fparty }, { fparty: sparty, sparty: fparty, date, debit: credit, credit: debit, narration }, { new: true });

    res.json({ update1, update2 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get balancesheet
app.get('/api/balancesheet', async (req, res) => {
  try {
    const result = await Sett.aggregate([
      { $group: { _id: "$fparty", totalDebit: { $sum: { $ifNull: ["$debit", 0] } }, totalCredit: { $sum: { $ifNull: ["$credit", 0] } }, totalCount: { $sum: 1 }, starCount: { $sum: { $cond: [{ $eq: ["$tally", "*"] }, 1, 0] } } } },
      { $sort: { _id: 1 } }
    ]);

    const credit = [], debit = [];
    result.forEach(party => {
      const netamt = party.totalDebit - party.totalCredit;
      const record = { fparty: party._id, netamt, star: party.totalCount === party.starCount ? '⭐' : '' };
      if (netamt > 0) credit.push(record);
      else if (netamt < 0) debit.push(record);
      else credit.push(record);
    });

    res.json({ credit, debit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update tally
app.post('/api/settlingentry/tally/:fparty', async (req, res) => {
  try {
    const { fparty } = req.params;
    const result = await Sett.updateMany({ fparty }, { $set: { tally: '*' } });
    res.json({ message: `Updated entries for ${fparty}`, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete all
app.delete('/api/deleteall', async (req, res) => {
  try {
    const deletedParties = await Party.deleteMany({});
    const deletedSetts = await Sett.deleteMany({});
    const deletedBalances = await Balance.deleteMany({});
    res.json({ deletedParties, deletedSetts, deletedBalances });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Catch-all for frontend
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(buildpath, 'index.html'));
});

// ------------------- Run server -------------------
if (require.main === module) {
  app.listen(port, '0.0.0.0', () => console.log(`Server running on http://localhost:${port}`));
}

module.exports = app;
