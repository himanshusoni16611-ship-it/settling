const dotenv = require('dotenv');

dotenv.config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true }
};

mongoose.connect(uri, clientOptions)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("MongoDB connection error:", err));

module.exports = mongoose;
