import bcrypt from 'bcrypt';
import config from '../../../config';

export class UserMap {
  static async toPersistence({ password, ...user }) {
    if (password) {
      const passwordHash = await bcrypt.hash(password, config.saltRounds);

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
    const { id, email, roles, profile, createdAt, updatedAt, isVerified } = raw;

    return { id, email, roles, profile, createdAt, updatedAt, isVerified };
  }
}
