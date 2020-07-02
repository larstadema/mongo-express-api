import { randomBytes } from 'crypto';

export const generateToken = () => {
  return randomBytes(40).toString('hex');
};
