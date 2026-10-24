import dotenv from 'dotenv';

dotenv.config();

const allowedClientUrls = (
  process.env.CLIENT_URL ??
  'http://localhost:5173,http://localhost:5174'
)
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const mongodbUri = process.env.MONGODB_URI?.trim();

if (!mongodbUri) {
  throw new Error(
    'MONGODB_URI is missing. Set it in your Render environment variables.'
  );
}

export const env = {
  PORT: Number(process.env.PORT ?? 5000),
  MONGODB_URI: mongodbUri,
  JWT_SECRET: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  CLIENT_URL: allowedClientUrls[0],
  CLIENT_URLS: allowedClientUrls,
};