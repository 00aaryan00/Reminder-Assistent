import * as dotenv from 'dotenv';
dotenv.config();

import { triggerReminderCall } from '../src/services/exotelService';
import prisma from '../src/utils/prisma';

async function runTestCall() {
  console.log('--- STARTING INSTANT EXOTEL TEST ---');
  
  // Fetch the first user to get their phone number
  const user = await prisma.user.findFirst({
    include: { settings: true }
  });

  if (!user || !user.settings?.userPhone) {
    console.error('❌ Could not find a user with a saved phone number in the database!');
    console.error('Please save your phone number on the frontend dashboard first.');
    process.exit(1);
  }

  console.log(`✅ Found user: ${user.name}`);
  console.log(`✅ Target Phone: ${user.settings.userPhone}`);
  
  // Trigger the call directly
  await triggerReminderCall(user.settings.userPhone, 'Manual Instant Test Meeting', 0);
  
  console.log('--- TEST FINISHED ---');
}

runTestCall()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
