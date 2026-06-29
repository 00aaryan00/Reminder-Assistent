import { Router } from 'express';
import { getGoogleAuthUrl, handleGoogleCallback, getCurrentUser, logout } from '../controllers/authController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.get('/google', getGoogleAuthUrl);
router.get('/google/callback', handleGoogleCallback);
router.get('/me', requireAuth, getCurrentUser);
router.post('/logout', logout);

export default router;
