import { Router, Request, Response } from 'express';

const router = Router();

// GET or POST /api/exotel/say
router.all('/say', (req: Request, res: Response) => {
  let message = req.query.message as string;
  
  if (!message) {
    console.log('[Exotel] Warning: message parameter missing. Using fallback.');
    message = 'Hello. This is your reminder. Have a great day.';
  }

  // Generate ExoML (XML) response
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>${message}</Say>
</Response>`;

  // Exotel requires application/xml content type
  res.type('application/xml').send(xml);
});

export default router;
