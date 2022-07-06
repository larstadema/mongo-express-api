import { randomBytes } from 'crypto';

export const generateToken = () => randomBytes(40).toString('hex');
