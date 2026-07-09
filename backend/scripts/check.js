const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const meetings = await prisma.meeting.findMany({
    orderBy: { startTime: 'desc' }
  });
  fs.writeFileSync('db-dump.json', JSON.stringify(meetings, null, 2));
  console.log('Dumped meetings to db-dump.json');
}

main().finally(() => prisma.$disconnect());
