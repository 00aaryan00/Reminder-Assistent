import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/exotel/say?message=...
router.get('/say', (req: Request, res: Response) => {
  const message = req.query.message as string;
  
  if (!message) {
    res.status(400).send('Missing message parameter');
    return;
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
