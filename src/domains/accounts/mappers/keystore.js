import config from '../../../config';
import { generateToken } from '../../../utils/generate-token';

export class KeystoreMap {
  static async toPersistence({ refreshToken, ...keystore }) {
    if (!refreshToken) {
      const expires = new Date(Date.now() + config.tokens.refreshToken.expiresInMs);

      return {
        ...keystore,
        expires,
        accessTokenKey: generateToken(),
        refreshToken: generateToken(),
      };
    }

    return refreshToken;
  }

  static toDomain(raw) {
    return raw.toObject();
  }

  static toDTO(raw) {
    const { refreshToken } = raw;

    return { refreshToken };
  }
}
