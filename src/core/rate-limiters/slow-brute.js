import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from '../../loaders/redis';
import config from '../../config';

/**
 *
 * @param {String} key Example: 'login_fail_ip_per_day'
 */
export const limitSlowBrute = (key) =>
  new RateLimiterRedis({
    redis: redisClient,
    keyPrefix: key,
    points: config.rateLimiters.slowBruteMaxAttempts,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
  });
