import { Router } from 'express';
import { createQuiz, deleteQuiz, getQuizById, listQuizzes, submitQuiz, updateQuiz } from '../controllers/quizController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listQuizzes);
router.get('/:id', authenticate, getQuizById);
router.post('/', authenticate, authorizeAdmin, createQuiz);
router.put('/:id', authenticate, authorizeAdmin, updateQuiz);
router.delete('/:id', authenticate, authorizeAdmin, deleteQuiz);
router.post('/:id/submit', authenticate, submitQuiz);

export default router;
