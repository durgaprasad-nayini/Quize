import { Schema, model } from 'mongoose';
import type { IQuiz } from '../types/index.js';

const questionSchema = new Schema(
  {
    id: { type: String, required: false },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

const quizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    durationMinutes: { type: Number, required: true },
    questions: { type: [questionSchema], required: true },
    createdBy: { type: String, default: 'system' },
  },
  { timestamps: true }
);

export const Quiz = model<IQuiz>('Quiz', quizSchema);
