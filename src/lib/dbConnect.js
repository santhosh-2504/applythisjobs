import mongoose from 'mongoose';
import dns from 'dns';

const MONGODB_URI = process.env.MONGO_URI;

const cached = global.mongoose || { conn: null, promise: null };

async function resolveDirectUri(srvUri) {
  try {
    const parsed = new URL(srvUri);
    const host = parsed.hostname;

    try {
      dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
    } catch (e) {}

    const srvRecords = await dns.promises.resolveSrv(`_mongodb._tcp.${host}`);
    if (srvRecords && srvRecords.length > 0) {
      const seedlist = srvRecords.map((r) => `${r.name}:${r.port}`).join(',');
      const userPass = parsed.username ? `${parsed.username}:${parsed.password}@` : '';
      const authSource = parsed.searchParams.get('authSource') || 'admin';
      const dbName = parsed.pathname.replace('/', '') || 'Job_Portal';

      return `mongodb://${userPass}${seedlist}/${dbName}?ssl=true&authSource=${authSource}&retryWrites=true&w=majority`;
    }
  } catch (err) {
    console.warn('DNS SRV resolution fallback notice:', err.message);
  }
  return srvUri;
}

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

    try {
      dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
    } catch (e) {}

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('MongoDB connected successfully to Job_Portal');
        return mongooseInstance;
      })
      .catch(async (err) => {
        if (err.code === 'ECONNREFUSED' && err.syscall === 'querySrv') {
          console.log('Local DNS SRV refused. Resolving direct shard seedlist fallback...');
          const directUri = await resolveDirectUri(MONGODB_URI);
          return mongoose.connect(directUri, opts).then((mongooseInstance) => {
            console.log('MongoDB connected successfully via direct shard fallback!');
            return mongooseInstance;
          });
        }
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
