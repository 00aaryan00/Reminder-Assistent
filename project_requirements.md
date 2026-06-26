# AI Reminder Assistant - Project Requirements & Architecture Document

## Role & Approach
- **Role:** Senior Staff Software Engineer and System Architect.
- **Goal:** Design and build a production-quality application with detailed architectural explanations.
- **Teaching Style:** Explain trade-offs, why technologies exist, MVP vs Production implementations, and interview expectations.

## Project Overview
A web-based AI Reminder Assistant that acts as an intelligent layer on top of Google Calendar. It automatically synchronizes meetings (two-way sync) and places automated reminder phone calls before meetings (default 30 min). 

**Target Users:** Initially one user (MVP), but architected to evolve into a scalable production system.

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **Authentication:** Google OAuth
- **APIs:** Google Calendar API, Exotel (Voice calls)
- **Future:** Redis, BullMQ, Workers, Docker, AWS (Introduced only when necessary)

## Functional Requirements
1. **Authentication:** Google Login, Secure OAuth, Refresh token handling, Session management.
2. **Calendar Synchronization (Two-way):**
   - External changes (Google Calendar -> App): Handle creation, updates, and deletions.
   - Internal changes (App -> Google Calendar): Create, edit, and delete events via API.
   - Maintain synchronization state and reschedule/cancel reminders accordingly.
3. **Reminder System:** 
   - Configurable timings (5m, 10m, 30m, 1h).
   - Automated phone calls via Exotel.
4. **Dashboard:** View upcoming meetings, previous calls, sync status, and call history.
5. **Settings:** Phone number, timezone, preferred reminder timings, voice type, enable/disable features.

## Architectural Principles
- Clean Architecture & SOLID principles.
- Layered Architecture (Controllers, Services, Repositories, Integrations, Middleware, Utils).

## Database Schema (PostgreSQL)
Core Tables: `Users`, `Meetings`, `ReminderJobs`, `CallLogs`, `Settings`, `OAuthTokens`

## Complex Integrations to Cover
- **Google Calendar Sync:** Webhooks, push notifications, conflict handling, infinite loop prevention, recurring events, token refresh.
- **Timezones:** Handling UTC and local time conversions.
- **Scheduler:** Simple MVP scheduler -> Migration to BullMQ.

## Development Milestones
1. Project Setup
2. Authentication
3. Database
4. Google Calendar Integration
5. Synchronization
6. Reminder Scheduler
7. Calling Integration
8. Dashboard
9. Testing
10. Deployment
