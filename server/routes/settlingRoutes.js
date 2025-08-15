const express = require('express');
const router = express.Router();
const settController = require('../controllers/SettlingControllers');

router.post('/', settController.createEntry);
router.get('/', settController.getEntries);
router.get('/:txtnId', settController.getSingleEntry);
router.delete('/:txtnId', settController.deleteEntry);
router.put('/:up_id', settController.updateEntry);
router.post('/tally/:fparty',settController.tallyEntry);

module.exports = router;
