import { google, calendar_v3 } from 'googleapis';
import { config } from '../config';
import prisma from './prisma';

export const getCalendarClient = async (userId: string): Promise<calendar_v3.Calendar> => {
  // 1. Fetch user's tokens from the database
  const tokenRecord = await prisma.oAuthToken.findUnique({
    where: { userId },
  });

  if (!tokenRecord) {
    throw new Error('OAuth tokens not found for user');
  }

  // 2. Initialize the OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUri
  );

  // 3. Set the credentials
  oauth2Client.setCredentials({
    access_token: tokenRecord.accessToken,
    refresh_token: tokenRecord.refreshToken,
    expiry_date: tokenRecord.expiry.getTime(),
  });

  // 4. Automatically save new tokens if the googleapis library refreshes them in the background
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      await prisma.oAuthToken.update({
        where: { userId },
        data: {
          accessToken: tokens.access_token,
          ...(tokens.refresh_token && { refreshToken: tokens.refresh_token }),
          ...(tokens.expiry_date && { expiry: new Date(tokens.expiry_date) }),
        },
      });
    }
  });

  // 5. Return the authorized Calendar API instance
  return google.calendar({ version: 'v3', auth: oauth2Client });
};

export const syncUserCalendar = async (userId: string): Promise<void> => {
  try {
    const calendar = await getCalendarClient(userId);
    
    const now = new Date();
    // Sync events for the next 7 days
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: nextWeek.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];

    for (const event of events) {
      if (!event.id || !event.start || !event.end) continue;

      const startTime = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date as string);
      const endTime = event.end.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date as string);
      
      await prisma.meeting.upsert({
        where: { googleEventId: event.id },
        update: {
          title: event.summary || 'Busy',
          startTime,
          endTime,
          status: event.status === 'cancelled' ? 'CANCELLED' : 'ACTIVE',
        },
        create: {
          userId,
          googleEventId: event.id,
          title: event.summary || 'Busy',
          startTime,
          endTime,
          originalTimezone: event.start.timeZone || 'UTC',
          status: event.status === 'cancelled' ? 'CANCELLED' : 'ACTIVE',
        }
      });
    }
    console.log(`[Sync] Successfully synced ${events.length} calendar events for user ${userId}`);
  } catch (error) {
    console.error(`[Sync] Failed to sync calendar for user ${userId}:`, error);
  }
};
