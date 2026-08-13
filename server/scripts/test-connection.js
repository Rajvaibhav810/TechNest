const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Success! Connected to MongoDB Atlas.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
  });