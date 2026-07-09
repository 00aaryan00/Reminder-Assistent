import prisma from '../src/utils/prisma';
import * as dotenv from 'dotenv';
dotenv.config();

async function check() {
  const meetings = await prisma.meeting.findMany({
    orderBy: { startTime: 'desc' }
  });
  console.log('--- RECENT MEETINGS IN DATABASE ---');
  meetings.slice(0, 5).forEach(m => {
    console.log(`Title: ${m.title}`);
    console.log(`StartTime: ${m.startTime} (UTC)`);
    console.log(`Original Timezone: ${m.originalTimezone}`);
    console.log('---');
  });
}
check().finally(() => prisma.$disconnect());
