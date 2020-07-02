import path from 'path';
import { readFile } from 'fs';
import { promisify } from 'util';
import { sign, verify } from 'jsonwebtoken';
import { Logger } from '../loaders/logger';
import { RequestError } from './api-error';
import config from '../config';

const readFileAsync = promisify(readFile);
const signAsync = promisify(sign);
const verifyAsync = promisify(verify);

const { expiresIn, audience, issuer } = config.tokens.accessToken;

const validatePayload = (payload) => {
  if (
    !payload ||
    !payload.iss ||
    !payload.sub ||
    !payload.aud ||
    !payload.atk ||
    payload.iss !== issuer ||
    payload.aud !== audience
  ) {
    throw new RequestError.UnauthorizedError('Invalid Access Token');
  }

  return payload;
};

export class JWT {
  static readPublicKey() {
    return readFileAsync(path.join(__dirname, '../../keys/public_key.pem'), 'utf8');
  }

  static readPrivateKey() {
    return readFileAsync(path.join(__dirname, '../../keys/private_key.pem'), 'utf8');
  }

  /**
   *
   * @param {Object} payload
   * @param {String} payload.atk - Access token hash used for key store
   * @param {String} payload.sub - User ID
   *
   * @returns {Promise<String>} Encoded JWT
   */
  static async encode(payload) {
    const cert = await this.readPrivateKey();

    // Copy instead payload into new object
    return signAsync({ ...payload }, cert, { algorithm: 'RS256', expiresIn, audience, issuer });
  }

  static async validate(token) {
    const cert = await this.readPublicKey();

    try {
      const payload = await verifyAsync(token, cert, { algorithm: 'RS256' });

      return validatePayload(payload);
    } catch (error) {
      Logger.debug(error);

      if (error.name === 'TokenExpiredError') {
        throw new RequestError.TokenExpiredError();
      }

      throw new RequestError.UnauthorizedError('Token is not valid');
    }
  }

  static async decode(token) {
    const cert = await this.readPublicKey();

    try {
      const payload = await verifyAsync(token, cert, {
        algorithm: 'RS256',
        ignoreExpiration: true,
      });

      return validatePayload(payload);
    } catch (error) {
      Logger.debug(error);
      throw new RequestError.UnauthorizedError('Token is not valid');
    }
  }
}
