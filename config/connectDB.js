const mongoose = require('mongoose');

const db = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_DBNAME}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB Atlas.');
  } catch (err) {
    console.error('An error occurred while trying to connect to MongoDB Atlas:', err.message);
    console.log('Terminating process...');
    process.exitCode = 1;
  }
};

module.exports = connectDB;
