import { describe, expect, it } from 'vitest';
import { calculateQuizResult } from './quizScoring.js';

describe('calculateQuizResult', () => {
  it('scores a quiz correctly and preserves unanswered questions', () => {
    const result = calculateQuizResult(
      [
        { questionId: 'q1', options: ['A', 'B', 'C'], correctAnswer: 'B' },
        { questionId: 'q2', options: ['A', 'B', 'C'], correctAnswer: 'A' },
        { questionId: 'q3', options: ['A', 'B', 'C'], correctAnswer: 'C' },
      ],
      {
        q1: 'B',
        q2: 'C',
        q3: undefined,
      }
    );

    expect(result.totalQuestions).toBe(3);
    expect(result.correctAnswers).toBe(1);
    expect(result.incorrectAnswers).toBe(1);
    expect(result.unanswered).toBe(1);
    expect(result.percentage).toBe(33.33);
  });
});
