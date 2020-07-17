import * as dotenv from 'dotenv';
import ms from 'ms';

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const databaseURL = `mongodb://${process.env.DB_USER}:${encodeURIComponent(
  process.env.DB_USER_PWD
)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export default {
  port: parseInt(process.env.PORT, 10),
  databaseURL: process.env.DB_URI || databaseURL,
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10,
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
  rateLimiters: {
    consecutiveFailAttemps: 10,
    slowBruteMaxAttempts: 100,
  },
};
