import { Schema, model } from 'mongoose';
import type { IQuizAttempt } from '../types/index.js';

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    title: { type: String, required: true },
    answers: { type: Object, default: {} },
    review: [
      {
        questionId: String,
        question: String,
        selectedAnswer: String,
        correctAnswer: String,
        explanation: String,
        isCorrect: Boolean,
      },
    ],
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    incorrectAnswers: { type: Number, required: true },
    unanswered: { type: Number, required: true },
    percentage: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
    timeSpentSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const QuizAttempt = model<IQuizAttempt>('QuizAttempt', quizAttemptSchema);
