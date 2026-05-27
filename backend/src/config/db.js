const mongoose = require('mongoose');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async ({ retries = 5, retryDelayMs = 3000 } = {}) => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment');
  }

  mongoose.set('strictQuery', true);

  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 20000,
        socketTimeoutMS: 45000,
      });
      console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (err) {
      lastError = err;
      const isLast = attempt === retries;
      const short = (err.message || '').split('\n')[0].slice(0, 160);
      console.warn(`MongoDB connect attempt ${attempt}/${retries} failed: ${short}`);
      if (!isLast) await sleep(retryDelayMs);
    }
  }
  throw lastError;
};

module.exports = connectDB;
