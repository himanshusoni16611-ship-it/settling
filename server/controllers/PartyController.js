const Party = require('../models/partyModel');

exports.addParty = async (req, res) => {
  try {
    const data = req.body;

    const existingParty = await Party.findOne({ pnm: data.pnm });
    if (existingParty) {
      return res.status(400).json({ error: 'Party already exists with this name' });
    }

    const newParty = new Party(data);
    const saved = await newParty.save();
    res.status(201).json({ message: 'Data saved successfully!', data: saved });
  } catch (err) {
    console.error('Error saving party:', err);
    res.status(500).json({ error: 'Server error while saving data', details: err.message });
  }
};

exports.getAllParties = async (req, res) => {
  try {
    const allParties = await Party.find({}).select('pnm');
    res.json(allParties);
  } catch (err) {
    console.error('Error fetching parties:', err);
    res.status(500).json({ error: 'Error fetching data' });
  }
};

//exports.deleteParty = async (req, res) => {
 // const Sett = require('../models/settModel'); // adjust to your correct schema file
  //try {
   // const { id } = req.params;
    //const party = await Party.findById(id);
   // if (!party) {
   //   return res.status(404).json({ error: 'Party not found' });
   // }

   // const partyName = party.pnm;
   // const entries = await Sett.find({ fparty: partyName });
   // const totalDebit = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
   // const totalCredit = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
   // const total = totalDebit - totalCredit;

   // if (total !== 0) {
    //  return res.status(400).json({ error: 'Cannot delete party. Balance is not zero' });
   // }

   // const deleted = await Party.findByIdAndDelete(id);
   // res.json({ message: 'Party deleted successfully', deleted });
  //} catch (err) {
   // console.error('Error deleting party:', err);
   // res.status(500).json({ error: 'Server error while deleting party' });
 // }
//};
