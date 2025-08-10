
const mongoose = require('mongoose');
const Party_schema = new mongoose.Schema({
    pnm:{
        type:String,
        required:true,
        trim:true,
    },
    gnm:{
        type:String,
        required:false,
        trim:true,
    },
mob:{
 type:String,
 trim: true,
  match: /^[0-9]{10}$/
},
jdate:{
    type:String,
  
    
}
})

module.exports = mongoose.model('Party',Party_schema);