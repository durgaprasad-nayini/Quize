import mongoose from 'mongoose';
import { env } from './env.js';
import { seedQuizzes } from '../utils/seed.js';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB connected');

    await seedQuizzes();
    console.log('Quiz seed check complete');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
};
