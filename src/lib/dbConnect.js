import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if environment does not support custom DNS servers
}

const MONGODB_URI = process.env.MONGO_URI;

const cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (!MONGODB_URI) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'Job_Portal'
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('MongoDB connected successfully to Job_Portal');
        return mongooseInstance;
      })
      .catch((err) => {
        console.error('MongoDB Connection Error:', err.message);
        cached.promise = null;
        throw err;
      });
  }
  
  try {
    cached.conn = await cached.promise;
    global.mongoose = cached;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default dbConnect;
