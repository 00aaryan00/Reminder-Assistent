import prisma from './prisma';
import { syncUserCalendar } from './googleCalendar';
import { triggerReminderCall } from '../services/exotelService';

let syncInterval: NodeJS.Timeout;
let reminderInterval: NodeJS.Timeout;

// In-memory cache to prevent double-calling meetings
const alreadyCalled = new Set<string>();

export const startScheduler = () => {
  console.log('[Scheduler] Starting background jobs...');

  // 1. Calendar Sync Loop
  // This automatically fetches new meetings from Google Calendar even if your browser is closed!
  const runCalendarSync = async () => {
    try {
      console.log('[Scheduler] Running calendar sync for all active users...');
      const users = await prisma.user.findMany({
        where: { settings: { isEnabled: true } }
      });

      for (const user of users) {
        await syncUserCalendar(user.id);
      }
    } catch (error) {
      console.error('[Scheduler] Error during calendar sync:', error);
    }
  };

  // Run it immediately on server boot!
  runCalendarSync();

  // Then keep running it every 15 minutes
  syncInterval = setInterval(runCalendarSync, 15 * 60 * 1000);

  // 2. Reminder Check Loop: Runs every 1 minute
  // This checks our database to see if we need to call anyone right now.
  reminderInterval = setInterval(async () => {
    try {
      const now = new Date();
      console.log(`[Scheduler] Checking for upcoming meetings at ${now.toLocaleTimeString()}...`);
      
      // Fetch all active meetings
      const meetings = await prisma.meeting.findMany({
        where: { status: 'ACTIVE' },
        include: { user: { include: { settings: true } } }
      });

      for (const meeting of meetings) {
        if (!meeting.user.settings?.isEnabled) continue;

        const reminderTimingMinutes = meeting.user.settings.reminderTiming;
        
        // Calculate exactly when the reminder should happen
        const reminderTime = new Date(meeting.startTime.getTime() - reminderTimingMinutes * 60 * 1000);
        
        // If the current time is exactly the reminder time (within the current minute)
        // We use absolute difference < 60 seconds since the loop runs every minute
        const timeDiffSeconds = Math.abs(now.getTime() - reminderTime.getTime()) / 1000;
        
        if (timeDiffSeconds < 60 && !alreadyCalled.has(meeting.id)) {
          alreadyCalled.add(meeting.id);
          console.log(`\n========================================`);
          console.log(`☎️ RING RING! Time to call ${meeting.user.name || 'User'}!`);
          console.log(`📅 Meeting: "${meeting.title}" starts in ${reminderTimingMinutes} minutes.`);
          console.log(`📞 Phone Number: ${meeting.user.settings.userPhone || 'NOT SET'}`);
          console.log(`========================================\n`);

          // Trigger the real call!
          if (meeting.user.settings.userPhone) {
            await triggerReminderCall(
              meeting.user.settings.userPhone,
              meeting.title,
              reminderTimingMinutes,
              meeting.startTime
            );
          } else {
            console.warn(`[Scheduler] Cannot call user ${meeting.userId} - no phone number set in settings.`);
          }
        }
      }
    } catch (error) {
      console.error('[Scheduler] Error checking reminders:', error);
    }
  }, 60 * 1000); // 1 minute
};
