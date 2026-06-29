import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnvVars = [
  'DATABASE_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI',
  'EXOTEL_SID',
  'EXOTEL_API_KEY',
  'EXOTEL_API_TOKEN',
  'EXOTEL_CALLER_ID'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`[CRITICAL ERROR]: Environment variable ${envVar} is missing.`);
    process.exit(1);
  }
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  env: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  sessionSecret: process.env.SESSION_SECRET || 'fallback-secret-for-session',
  
  databaseUrl: process.env.DATABASE_URL as string,
  
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirectUri: process.env.GOOGLE_REDIRECT_URI as string,
  },
  
  exotel: {
    sid: process.env.EXOTEL_SID as string,
    apiKey: process.env.EXOTEL_API_KEY as string,
    apiToken: process.env.EXOTEL_API_TOKEN as string,
    subdomain: process.env.EXOTEL_SUBDOMAIN || 'api.exotel.com',
    callerId: process.env.EXOTEL_CALLER_ID as string,
  }
};
export type Config = typeof config;
