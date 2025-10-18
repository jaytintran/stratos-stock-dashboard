#!/usr/bin/env node

// Super simple MongoDB connection test
// Usage: npm run test:db

import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

async function main() {
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { bufferCommands: false });
    const c = mongoose.connection;
    console.log(`✅ Connected to MongoDB: ${c.name} @ ${c.host}:${c.port}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('❌ Connection failed:', msg);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('ℹ️  Disconnected');
    }
  }

  process.exit(0);
}

main();
