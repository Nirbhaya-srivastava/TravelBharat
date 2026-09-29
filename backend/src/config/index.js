import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'travelbharat_jwt_secret_dev_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

let isConnected = false;

export const connectDB = async () => {
  if (!config.mongoUri) {
    console.log('ℹ️ [Database] No MONGODB_URI provided in environment. Running in in-memory resilience mode with full dataset.');
    return false;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`✅ [Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ [Database] MongoDB connection error: ${error.message}. Continuing in in-memory resilience mode.`);
    isConnected = false;
    return false;
  }
};

export const isDbConnected = () => isConnected;
