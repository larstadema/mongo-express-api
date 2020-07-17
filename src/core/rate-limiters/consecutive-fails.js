import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from '../../loaders/redis';
import config from '../../config';

/**
 *
 * @param {String} key 'Example: login_fail_consecutive_username_and_ip'
 */
export const limitConsecutiveFails = (key) =>
  new RateLimiterRedis({
    redis: redisClient,
    keyPrefix: key,
    points: config.rateLimiters.consecutiveFailAttemps,
    duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
    blockDuration: 60 * 60 * 24 * 365 * 20, // Block for infinity after consecutive fails
  });
