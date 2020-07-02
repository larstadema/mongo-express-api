import dotenv from 'dotenv';
import ms from 'ms';

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.PORT, 10),
  databaseURL: process.env.MONGODB_URI,
  hashPepper: process.env.HASH_PEPPER,
  logs: {
    level: process.env.LOG_LEVEL || 'debug',
  },
  // agenda: {
  //   dbCollection: process.env.AGENDA_DB_COLLECTION,
  //   pooltime: process.env.AGENDA_POOL_TIME,
  //   concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  // },
  api: {
    prefix: '/api',
    corsOrigin: process.env.CORS_ORIGIN,
  },
  tokens: {
    accessToken: {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    refreshToken: {
      expiresInMs: ms(process.env.REFRESH_TOKEN_EXPIRES_IN),
    },
  },
};
