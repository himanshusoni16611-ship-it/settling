//called express in appś
const express = require('express')
//for party schema
const Party = require('./schema'); // ✅ use correct path and variable name
//for settling schema
const Sett = require('./settschema');
//for balancexheet schema 
const Balance = require('./balanceschema');
//for pass data
const bodyParser = require('body-parser')
//port is defined in it
const fs = require('fs');
//connecttion file its most important
const db = require('./db'); // ✅ Correct path
const path = require('path');
const buildpath = path.join(__dirname,'..',"build");
if (fs.existsSync(buildpath)) {
  console.log('Build folder exists:', buildpath);
} else {
  console.log('Build folder NOT found:', buildpath);
}
const dotenv = require('dotenv');

dotenv.config();

const cors = require('cors')

const app = express()

//console.log(db);
app.use(bodyParser.json())


app.use(express.static(buildpath));
//@himanshusoni16611-ship-it = github
app.use(cors({
  origin: [
    'http://localhost:3000',
  'https://cute-beijinho-d62c23.netlify.app/',
  ]
}));
const port = process.env.PORT||5000




app.post('/partyadd', async (req, res) => {
  console.log('Received data:', req.body);
  try {
    const data = req.body;

    const existing_party = await Party.findOne({pnm:data.pnm});
    if(existing_party){
         return res.status(400).json({ error: 'Party already exists with this name' });
    }

    const nparty = new Party(data);
    const saved = await nparty.save();
    console.log('Saved data:', saved);
    res.status(201).json({ message: 'Data saved successfully!', data: saved });
  } catch (err) {
    console.error('Error saving data:', err);  // <--- full error logged here
    res.status(500).json({ error: 'Server error while saving data', details: err.message });
  }
});


app.get('/partyadd', async (req, res) => {
  try {
    const allParties = await Party.find({}).select('pnm'); 
    res.json(allParties); // ✅ Send the data as JSON
  } catch (err) {
    console.error('Error fetching parties:', err);
    res.status(500).json({ error: 'Error fetching data' });
  }
});
app.delete('/partyadd/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting party with id:', id);


const party = await Party.findById(id);
if(!party){
   return res.status(404).json({ error: 'Party not found' });
}
const partyName = party.pnm;

const entries = await Sett.find({fparty:partyName});

const totalDebit = entries.reduce((sum,entry)=>sum+(entry.debit||0),0);
const totalCredit = entries.reduce((sum,entry)=>sum+(entry.credit||0),0);
const total = totalDebit-totalCredit;
console.log(total);
if(total!== 0){
 return res.status(400).json({
        error: `Cannot delete party. Balance is not zero`,
      });
}
    const deleted = await Party.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Party not found' });
    }

    res.json({ message: 'Party deleted successfully', deleted });
  } catch (err) {
    console.error('Error deleting party:', err);
    res.status(500).json({ error: 'Server error while deleting party' });
  }
});


app.post('/settlingentry', async (req, res) => {
 
  try{
let { date , fparty , sparty , debit , credit , narration,tally} = req.body;

if(!fparty||!sparty){
   return res.status(400).json({ message: 'Both fparty and sparty are required.' });
} 

const txtnId = Date.now();
const Enteries=[
  {
    txtnId,
    date,
    fparty,
    sparty,
    debit:debit,
    credit:credit,
    narration,
    tally,
  },
  {
    txtnId,
      date,  
    fparty:sparty,
    sparty:fparty,
    debit:credit,
    credit:debit,
    narration,
tally,
  }
];
const savedEntry = await Sett.insertMany(Enteries);
console.log(savedEntry);  
const latest = savedEntry.find((e) => e.fparty === fparty);
res.status(201).json({
      message: 'Cross entries saved successfully!',
      data: savedEntry,
      latestId : latest?._id
    });
  }catch(error){
 console.error('ERROR saving cross entries:', error);
    res.status(500).json({ message: 'Error saving data', error: error.message });
  }
});




app.get('/settlingentry', async (req, res) => {
  try {
    const fparty = req.query.fparty; // get from query param
    if (!fparty) {
      return res.status(400).json({ message: 'fparty query parameter is required' });
    }
    const results = await Sett.find({ fparty })
    .select('date sparty debit credit narration txtnId tally')
    .sort({date:1,sparty:1});
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.delete('/settlingentry/:txtnId',async(req,res)=>{
  try{
  // why here used param instead of id dought
    const { txtnId } = req.params;
  console.log(txtnId);
    const deleted = await Sett.deleteMany({txtnId});
    if(deleted){
return res.status(200).json({ message: "Delete success", txtnId });
    }else{
      return res.status(404).json({ message: 'Entry not found' });
    }
  }catch(error){
    console.error(error);
    res.status(500).json({message:'server error'});
  }
})

app.get('/settlingentry/:txtnId',async(req,res)=>{
  try{
    const txtnId = req.params.txtnId;
    const entry = await Sett.findOne({txtnId}).exec();

    res.status(200).json(entry);

  }catch(error){
    console.error(error);
  }
})

app.put('/settlingentry/:up_id', async (req, res) => {
  const { up_id } = req.params;
  const { fparty, date, sparty, debit, credit, narration } = req.body;

  try {
    // Find the first document by ID to extract the txtnId
    const originalEntry = await Sett.findById(up_id);
    if (!originalEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    const { txtnId } = originalEntry;

    // Update the first entry
    const updateEntry1 = await Sett.findByIdAndUpdate(
      up_id,
      { fparty, sparty, date, debit, credit, narration },
      { new: true }
    );

    // Update the second entry (reversed party and amounts)
    const updateEntry2 = await Sett.findOneAndUpdate(
      {
        txtnId,
        fparty: sparty,
        sparty: fparty
      },
      {
        fparty: sparty,
        sparty: fparty,
        date,
        debit: credit,
        credit: debit,
        narration
      },
      { new: true }
    );

    res.status(200).json({ updateEntry1, updateEntry2 });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Update failed', error });
  }
});


//aggregate is a powerful method in MongoDB used to process data and perform complex operations like filtering, grouping, sorting, and calculating totals.
//It works by passing an aggregation pipeline, which is a sequence of stages that transform the data step-by-step.
//Common stages include:
//$match — filters documents

//$group — groups documents by a key and calculates aggregates like sums, counts, averages

//$sort — sorts results

//$project — selects specific fields or computes new ones

app.get('/balancesheet', async (req, res) => {
  try {
    const results = await Sett.aggregate([
      {
        $group: {               // <-- $group needs a dollar sign
          _id: "$fparty",       // _id is the grouping key
          totalDebit: { $sum: { $ifNull: ["$debit", 0] } },
          totalCredit: { $sum: { $ifNull: ["$credit", 0] } },
                    
        }
      }
    ]);

    const leftData = [];       // use camelCase and no commas here
    const rightData = [];

    results.forEach(({ _id, totalDebit, totalCredit }) => {
      const netamt = totalDebit - totalCredit;
      if (netamt > 0) {
        leftData.push({ fparty:_id, netamt});
      } else if (netamt < 0) {
        rightData.push({ fparty:_id, netamt});
      }
    });
    res.json({ leftData, rightData });
  } catch (err) {
    console.error("Error in /balancesheet:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/tally/:fparty',async(req,res)=>{
try{
  const {fparty} = req.params;

const result = await Sett.updateMany(
  {fparty},
  {$set:{tally:'*'}},
);
res.json({
  message: `Entries for '${fparty}' updated with a star.`,
      modifiedCount: result.modifiedCount,
})
}catch(err){
console.error("error");
}
})
app.delete('/deleteall', async (req, res) => {
  try {
    const deletedParties = await Party.deleteMany({});
    const deletedSetts = await Sett.deleteMany({});
    const deletedBalances = await Balance.deleteMany({});

    res.status(200).json({
      message: 'All records deleted successfully',
      deleted: {
        parties: deletedParties.deletedCount,
        settEntries: deletedSetts.deletedCount,
        balances: deletedBalances.deletedCount
      }
    });
  } catch (err) {
    console.error('Error deleting all data:', err);
    res.status(500).json({ error: 'Server error during deletion' });
  }
});

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.originalUrl);
  next();
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(buildpath, 'index.html'));
  console.log('Serving index.html from', buildpath);
});



app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

