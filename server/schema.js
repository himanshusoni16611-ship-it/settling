
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
Party_schema.index({pnm:1});
module.exports = mongoose.model('Party',Party_schema);