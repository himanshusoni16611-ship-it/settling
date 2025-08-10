const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Replace with your actual username and password
const uri = 'mongodb+srv://mknewest:mk50032266@cluster0.ailv9vf.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(uri)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

mongoose.connection.on('connected', () => {
  console.log('🔌 Mongoose connection established.');
});

mongoose.connection.on('error', (err) => {
  console.error('⚠️ Mongoose connection error:', err);
});

module.exports = mongoose;
