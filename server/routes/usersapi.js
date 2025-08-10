const express = require('express')

const router = express.Router();

const User = require('schema');

router.post('/adduser',async(req,res)=>{
    try{

         const newUser = new User({
user_name:req.body.user_name,
user_pass:req.body.user_pass,
user_dob:req.body.user_dob,
user_gender:req.body.gender,
    })
    const saveuser = await newUser.save();
res.json(saveuser);
    }catch(err){
console.log("error",err);     
    }
   })