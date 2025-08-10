const express = require('express');
const router = express.Router();
const{
    addParty,
    getAllParties,
   // deleteParty,

}=require('../controllers/PartyController');

router.post('/partyadd',addParty);
router.get('/partyadd',getAllParties);
///router.delete('/partyadd',deleteParty);
module.exports=router;