import { defineConfig, env } from 'prisma/config';
import dotenv from 'dotenv';
import path from 'path';

// Load .env variables so Prisma 7 configuration can access them
dotenv.config({ path: path.join(__dirname, '.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL') || 'postgresql://postgres:postgres@localhost:5432/postgres',
  },
});
