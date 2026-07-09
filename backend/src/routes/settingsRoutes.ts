import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

// All settings routes require the user to be authenticated
router.use(requireAuth);

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
