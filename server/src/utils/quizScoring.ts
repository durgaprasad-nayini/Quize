export interface QuizQuestionForScoring {
  questionId: string;
  correctAnswer: string;
  options: string[];
}

export interface AnswerSubmission {
  [questionId: string]: string | undefined;
}

export interface QuizScoringResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  percentage: number;
}

export const calculateQuizResult = (
  questions: QuizQuestionForScoring[],
  answers: AnswerSubmission
): QuizScoringResult => {
  const totalQuestions = questions.length;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unanswered = 0;

  for (const question of questions) {
    const selectedAnswer = answers[question.questionId];

    if (!selectedAnswer) {
      unanswered += 1;
      continue;
    }

    if (selectedAnswer === question.correctAnswer) {
      correctAnswers += 1;
    } else {
      incorrectAnswers += 1;
    }
  }

  const percentage = totalQuestions === 0 ? 0 : Number(((correctAnswers / totalQuestions) * 100).toFixed(2));

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    unanswered,
    percentage,
  };
};
