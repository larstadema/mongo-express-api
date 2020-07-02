import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import config from '../../../config';

export class UserMap {
  static async toPersistence({ password, ...user }) {
    if (password) {
      const salt = randomBytes(32);
      const hashOptions = {
        salt,
        secret: Buffer.from(config.hashPepper),
      };

      const passwordHash = await argon2.hash(password, hashOptions);

      return {
        ...user,
        passwordHash,
      };
    }

    return user;
  }

  static toDomain(raw) {
    return raw.toObject();
  }

  static toDTO(raw) {
    const { id, email, role, profile, createdAt, updatedAt, isVerified } = raw;

    return { id, email, role, profile, createdAt, updatedAt, isVerified };
  }
}
