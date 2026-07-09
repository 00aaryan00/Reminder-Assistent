import { Router, Request, Response } from 'express';

const router = Router();

// GET or POST /api/exotel/say
router.all('/say', (req: Request, res: Response) => {
  // Exotel Passthru sends data either via query or body depending on the HTTP method
  let message = (req.query.CustomField || req.body.CustomField) as string;
  
  console.log(`[Exotel] Incoming request! Method: ${req.method}, CustomField: ${message}`);

  if (!message) {
    console.log('[Exotel] Warning: CustomField parameter missing. Using fallback.');
    message = 'Hello. This is your reminder. Have a great day.';
  }

  // Exotel's Greeting Applet dynamic TTS requires text/plain response (NO XML)
  res.type('text/plain').send(message);
});

export default router;
