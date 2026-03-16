const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI is not set in .env file!');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverApi: { version: '1', strict: true, deprecationErrors: true }
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully!');
    // Ping to confirm
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('📡 MongoDB ping: OK');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
