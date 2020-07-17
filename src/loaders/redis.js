import Redis from 'ioredis';
import config from '../config';

export const redisClient = new Redis(config.redis.port, config.redis.host, { lazyConnect: true });

export const redisLoader = async () => {
  await redisClient.connect();

  return redisClient;
};
