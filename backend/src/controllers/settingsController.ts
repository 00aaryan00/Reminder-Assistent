import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const settings = await prisma.setting.findUnique({
      where: { userId: req.userId },
    });

    if (!settings) {
      res.status(404).json({ error: 'Settings not found' });
      return;
    }

    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { displayTimezone, reminderTiming, isEnabled, userPhone, exotelNumber } = req.body;

    // Update settings in database
    const updatedSettings = await prisma.setting.update({
      where: { userId: req.userId },
      data: {
        ...(displayTimezone && { displayTimezone }),
        ...(reminderTiming !== undefined && { reminderTiming: Number(reminderTiming) }),
        ...(isEnabled !== undefined && { isEnabled: Boolean(isEnabled) }),
        ...(userPhone !== undefined && { userPhone }),
        ...(exotelNumber !== undefined && { exotelNumber }),
      },
    });

    res.status(200).json({ message: 'Settings updated successfully', settings: updatedSettings });
  } catch (error) {
    next(error);
  }
};
