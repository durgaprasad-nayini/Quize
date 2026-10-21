import { Schema, model } from 'mongoose';
import type { IUser } from '../types/index.js';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: false, default: '', trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
