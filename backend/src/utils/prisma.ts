import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from '../config';

const connectionString = config.databaseUrl || process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Single instance of Prisma Client to prevent multiple connection pools
export const prisma = new PrismaClient({ adapter });
export default prisma;
