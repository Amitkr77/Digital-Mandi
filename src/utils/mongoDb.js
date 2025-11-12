import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env');
}

let cached = {
  conn: null,
  promise: null,
};

async function dbConnect() {
  if (cached.conn) {
    console.log('Reusing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Establishing new MongoDB connection...');

    // Storing the connection promise for caching
    cached.promise = mongoose.connect(MONGODB_URI)
      .then((mongoose) => {
        console.log('MongoDB Connected');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB Connection Error:', error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;