import { Router } from 'express';
import { getAttemptById, getAttemptHistory } from '../controllers/attemptController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getAttemptHistory);
router.get('/:id', authenticate, getAttemptById);

export default router;
