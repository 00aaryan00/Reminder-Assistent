import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

interface DecodedToken {
  userId: string;
  email: string;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const sessionToken = req.cookies?.session;

  if (!sessionToken) {
    res.status(401).json({ error: 'Unauthorized: Session cookie is missing' });
    return;
  }

  try {
    const decoded = jwt.verify(sessionToken, config.sessionSecret) as DecodedToken;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Session is invalid or expired' });
  }
};
