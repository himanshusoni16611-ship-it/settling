const Party = require('../models/Party');
const Sett = require('../models/Sett'); // for checking balance

exports.addParty = async (req, res) => {
  try {
    const data = req.body;
    const existing = await Party.findOne({ pnm: data.pnm });

    if (existing) {
      return res.status(400).json({ error: 'Party already exists' });
    }

    const party = new Party(data);
    const saved = await party.save();
    res.status(201).json({ message: 'Party saved', data: saved });
  } catch (err) {
    console.error('Error saving party:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.getAllParties = async (req, res) => {
  try {
    const parties = await Party.find({}).select('pnm');
    res.json(parties);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching parties' });
  }
};

exports.deleteParty = async (req, res) => {
  try {
    const { id } = req.params;

    const party = await Party.findById(id);
    if (!party) return res.status(404).json({ error: 'Party not found' });

    const partyName = party.pnm;
    const entries = await Sett.find({ fparty: partyName });

    const totalDebit = entries.reduce((sum, e) => sum + (e.debit || 0), 0);
    const totalCredit = entries.reduce((sum, e) => sum + (e.credit || 0), 0);

    if (totalDebit - totalCredit !== 0) {
      return res.status(400).json({ error: 'Cannot delete party. Balance is not zero.' });
    }

    const deleted = await Party.findByIdAndDelete(id);
    res.json({ message: 'Party deleted', deleted });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting party' });
  }
};
