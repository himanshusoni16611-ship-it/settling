const express = require('express');
const router = express.Router();

const {
  addParty,
  getAllParties,
  deleteParty
} = require('../controllers/partycontroller');

router.post('/partyadd', addParty);
router.get('/partyadd', getAllParties);
router.delete('/partyadd/:id', deleteParty);

module.exports = router;
