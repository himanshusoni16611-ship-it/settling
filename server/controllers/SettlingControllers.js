const Sett = require('../models/SettlingModels');

// POST - Create cross entries
exports.createEntry = async (req, res) => {
  try {
    let { date, fparty, sparty, debit, credit, narration, tally } = req.body;

    if (!fparty || !sparty) {
      return res.status(400).json({ message: 'Both fparty and sparty are required.' });
    }

    const txtnId = Date.now();

    const entries = [
      { txtnId, date, fparty, sparty, debit, credit, narration, tally },
      { txtnId, date, fparty: sparty, sparty: fparty, debit: credit, credit: debit, narration, tally }
    ];

    const savedEntry = await Sett.insertMany(entries);
    const latest = savedEntry.find(e => e.fparty === fparty);

    res.status(201).json({
      message: 'Cross entries saved successfully!',
      data: savedEntry,
      latestId: latest?._id
    });
  } catch (error) {
    console.error('ERROR saving cross entries:', error);
    res.status(500).json({ message: 'Error saving data', error: error.message });
  }
};

// GET - All entries for one fparty
exports.getEntries = async (req, res) => {
  try {
    const { fparty } = req.query;
    if (!fparty) {
      return res.status(400).json({ message: 'fparty query parameter is required' });
    }

    const results = await Sett.find({ fparty })
      .select('date sparty debit credit narration txtnId tally created')
      .sort({ date: 1, sparty: 1,created:1 });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE - Remove both entries by txtnId
exports.deleteEntry = async (req, res) => {
  try {
    const { txtnId } = req.params;
    const deleted = await Sett.deleteMany({ txtnId });

    if (deleted.deletedCount > 0) {
      return res.status(200).json({ message: 'Delete success', txtnId });
    } else {
      return res.status(404).json({ message: 'Entry not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET - Single entry by txtnId
exports.getSingleEntry = async (req, res) => {
  try {
    const { txtnId } = req.params;
    const entry = await Sett.findOne({ txtnId }).exec();
    res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT - Update both cross entries
exports.updateEntry = async (req, res) => {
  const { up_id } = req.params;
  const { fparty, date, sparty, debit, credit, narration } = req.body;

  try {
    const originalEntry = await Sett.findById(up_id);
    if (!originalEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    const { txtnId } = originalEntry;

    const updateEntry1 = await Sett.findByIdAndUpdate(
      up_id,
      { fparty, sparty, date, debit, credit, narration },
      { new: true }
    );

    const updateEntry2 = await Sett.findOneAndUpdate(
      { txtnId, fparty: sparty, sparty: fparty },
      { fparty: sparty, sparty: fparty, date, debit: credit, credit: debit, narration },
      { new: true }
    );

    res.status(200).json({ updateEntry1, updateEntry2 });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Update failed', error });
  }
};

exports.tallyEntry = async (req, res) => {
  try {
    const { fparty } = req.params;

    const result = await Sett.updateMany(
      { fparty },
      { $set: { tally: '*' } }
    );

    res.json({
      message: `Entries for '${fparty}' updated with a star.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Tally update error:", err);
    res.status(500).json({ error: 'Server error during tally update' });
  }
};
