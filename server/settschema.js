
const mongoose = require('mongoose');


const sett_schema = new mongoose.Schema({
txtnId:{
  type: String,               
    required: true
 
},
 date: {
  type: String,
  required: true,
  
}
,
  fparty: {
    type: String,
    required: true,
  },
  sparty: {
    type: String,
    required: true,
  },
  debit: {
    type: Number,
  },
  credit: {
    type: Number,
  },
  narration: {                
    type: String,

  },
 tally: {
    type: String,   
    default: ""     
  },
created: {
  type: Date,
  default: Date.now,  
}

});


sett_schema.index({ date: 1 });

module.exports = mongoose.model('Settling', sett_schema);
