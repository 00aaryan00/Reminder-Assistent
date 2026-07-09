import { Router } from 'express';
import { getUpcomingMeetings } from '../controllers/calendarController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

// All calendar routes require the user to be authenticated
router.use(requireAuth);

router.get('/upcoming', getUpcomingMeetings);

export default router;
