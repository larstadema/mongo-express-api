import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import config from '../../../config';
import { RequestError } from '../../../core/errors';
import { UserMap } from '../../users';

class AuthService {
  constructor(container) {
    this.logger = container.get('logger');
    this.userRepo = container.get('userRepo');
  }

  async SignUp(userInput) {
    try {
      if (this.userRepo.exists(userInput.email)) {
        throw new RequestError.ConflictError('User already exists');
      }

      const salt = randomBytes(32);

      this.logger.silly('Hashing password');

      const hashOptions = {
        salt,
        secret: Buffer.from(config.hashPepper),
      };

      const hashedPassword = await argon2.hash(userInput.password, hashOptions);
      this.logger.silly('Creating user db record');

      const userRecord = await this.userRepo.save({
        ...userInput,
        salt: salt.toString('hex'),
        password: hashedPassword,
      });

      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      if (!userRecord) {
        throw new RequestError.InternalServerError('User cannot be created');
      }

      const user = UserMap.toDTO(userRecord);
      return { user, token };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async SignIn(email, password) {
    const userRecord = await this.userRepo.findUserByEmail(email);

    if (!userRecord) {
      throw new RequestError.NotFoundError('User not registered');
    }

    this.logger.silly('Checking password');
    const validPassword = await argon2.verify(userRecord.password, password, {
      secret: Buffer.from(config.hashPepper),
    });

    if (validPassword) {
      this.logger.silly('Password is valid!');
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      const user = UserMap.toDTO(userRecord);

      return { user, token };
    }

    throw new RequestError.UnauthorizedError('Invalid Password');
  }

  generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id,
        role: user.role,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }
}

export { AuthService };
