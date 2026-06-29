# AI Reminder Assistant - Project Requirements

## Overview
A web-based AI Reminder Assistant that acts as an intelligent layer on top of Google Calendar. It synchronizes meetings (two-way) and automatically places automated reminder phone calls (via Exotel) before the meetings start.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS (Vite)
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Google OAuth
- **Calendar**: Google Calendar API
- **Calling**: Exotel

## Functional Requirements
### 1. Authentication
- Google Login, Secure OAuth, Refresh token handling, Session management.

### 2. Calendar Synchronization (Two-way)
- Application auto-receives updates when events are created/edited/deleted in Google Calendar, stores meetings, and schedules reminders.
- Application handles events created/edited/deleted from within the app, syncing them back to Google Calendar.

### 3. Reminder System (Voice Call)
- User chooses reminder timing (5, 10, 30 min, 1 hr).
- System automatically places a phone call using Exotel at the correct time, converting local time to UTC internally, and announcing the relative time (e.g., "Your meeting starts in 30 minutes") to avoid timezone confusion for travelers.

### 4. Dashboard
- Displays Upcoming Meetings, Previous Calls, Connected Account, Call History, and Settings.

### 5. Settings
- Phone number, display timezone, reminder timings, voice type, enable/disable reminders, etc.

## Database Schema (PostgreSQL)
- **Users**: Core user profile data.
- **OAuthTokens**: Securely stores the Refresh and Access Tokens from Google.
- **Settings**: Stores timezone, Exotel number preferences, and reminder configurations.
- **Meetings**: Stores all synced calendar events (times stored in UTC, alongside `originalTimezone`).
- **ReminderJobs**: Maps a meeting to a scheduled Exotel trigger time.
- **CallLogs**: History of executed calls and their status.

## Future Scalability Considerations
- Migration to BullMQ + Redis for distributed background jobs.
- Worker processes.
- Docker & AWS deployment.
