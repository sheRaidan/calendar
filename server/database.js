import mongoose from 'mongoose';

let connectionPromise;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not configured');
    connectionPromise = mongoose.connect(uri).finally(() => {
      connectionPromise = undefined;
    });
  }
  await connectionPromise;
}
