import argon2 from 'argon2';
import config from '../../../config';
import { RequestError } from '../../../core/api-error';
import { Roles } from '../../../core/roles';
import { generateToken } from '../../../utils/generate-token';
import { UserMap, KeystoreMap } from '../mappers';
import { JWT } from '../../../core/jwt';

class AccountService {
  constructor(container) {
    this.logger = container.get('logger');
    this.userRepo = container.get('userRepo');
    this.keystoreRepo = container.get('keystoreRepo');
  }

  async register(userInput, origin) {
    const exists = await this.userRepo.exists(userInput.email);
    if (exists) {
      // send email to already registered user in order to prevent user enumeration
      // return await sendAlreadyRegisteredEmail(params.email, origin);
      this.logger.info('[Register] - already registered with: ', { email: userInput.email });
      return;
    }

    this.logger.silly('Creating user db record');
    const userRecord = await this.userRepo.save({
      ...userInput,
      role: Roles.User,
      verificationToken: generateToken(),
    });

    if (!userRecord) {
      throw new RequestError.InternalServerError('User cannot be created');
    }

    // TODO: Replace log with actual email
    // await sendRegistrationEmail(userRecord, origin)
    this.logger.info(
      `[Register] - verificationToken: ${userRecord.verificationToken} from ${origin}`
    );
  }

  async login({ email, password }, ipAddress) {
    const userRecord = await this.userRepo.findByEmail(email);

    if (!userRecord) {
      throw new RequestError.NotFoundError('Email or password is incorrect');
    }

    if (!userRecord.isVerified) {
      throw new RequestError.NotFoundError('User not verified');
    }

    this.logger.silly('Checking password');
    const validPassword = await argon2.verify(userRecord.passwordHash, password, {
      secret: Buffer.from(config.hashPepper),
    });

    if (!validPassword) {
      throw new RequestError.BadRequestError('Email or password is incorrect');
    }

    this.logger.silly('Password is valid!');

    this.logger.silly('Generating refresh token');
    const keystoreRecord = await this.keystoreRepo.save({
      user: userRecord.id,
      createdByIp: ipAddress,
    });

    this.logger.silly('Generating JWT');
    const jwtToken = await JWT.encode({
      atk: keystoreRecord.accessTokenKey,
      sub: userRecord.id,
    });

    const user = UserMap.toDTO(userRecord);
    const { refreshToken } = KeystoreMap.toDTO(keystoreRecord);

    return { user, token: jwtToken, refreshToken };
  }

  async logout(keystore) {
    return this.keystoreRepo.delete(keystore.id);
  }

  async refreshToken(userId, token, accessTokenKey, ipAddress) {
    const keystoreRecord = await this.keystoreRepo.find(userId, token, accessTokenKey);

    if (!keystoreRecord) {
      throw new RequestError.BadRequestError('Invalid token');
    }

    const newRefreshTokenRecord = await this.keystoreRepo.save({
      user: keystoreRecord.user.id,
      createdByIp: ipAddress,
    });

    await this.keystoreRepo.revokeByToken(
      keystoreRecord.refreshToken,
      newRefreshTokenRecord.refreshToken,
      ipAddress
    );

    const jwtToken = await JWT.encode({
      atk: newRefreshTokenRecord.accessTokenKey,
      sub: keystoreRecord.user.id,
    });

    const { refreshToken } = KeystoreMap.toDTO(newRefreshTokenRecord);

    return { token: jwtToken, refreshToken };
  }

  async revokeToken(token, ipAddress) {
    const keystoreRecord = await this.keystoreRepo.findByToken(token);

    if (!keystoreRecord || !keystoreRecord.isActive) {
      throw new RequestError.BadRequestError('Invalid token');
    }

    await this.keystoreRepo.revokeByToken(keystoreRecord.refreshToken, undefined, ipAddress);
  }

  async verifyEmail({ token }) {
    const userRecord = await this.userRepo.findByVerificationToken(token);

    if (!userRecord) {
      throw new RequestError.NotFoundError('Token not found');
    }

    await this.userRepo.save({
      email: userRecord.email,
      verified: Date.now(),
      verificationToken: undefined,
    });
  }

  async forgotPassword({ email }, origin) {
    const userRecord = await this.userRepo.findByEmail(email);

    // Return ok response to prevent email enumeration
    if (!userRecord) {
      return;
    }

    const token = generateToken();
    this.userRepo.save({
      email: userRecord.email,
      resetToken: {
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // TODO: Replace log with actual email
    // await sendPasswordResetEmail(token, origin)
    this.logger.info(`[ForgotPassword] - verificationToken: ${token} from ${origin}`);
  }

  async resetPassword({ token, password }) {
    const userRecord = await this.userRepo.findByResetToken(token);

    if (!userRecord) {
      throw new RequestError.BadRequestError('Invalid token');
    }

    this.logger.silly('Checking password');
    const samePassword = await argon2.verify(userRecord.passwordHash, password, {
      secret: Buffer.from(config.hashPepper),
    });

    if (samePassword) {
      throw new RequestError.ConflictError('Please choose a different password');
    }

    await this.userRepo.save({
      email: userRecord.email,
      password,
      passwordReset: Date.now(),
      resetToken: undefined,
    });
  }

  async getAll(props) {
    const { limit = 50, next, previous, sortAscending } = props;
    const paginatedRecord = await this.userRepo.findByPagination({
      limit,
      next,
      previous,
      sortAscending,
    });

    if (!paginatedRecord) {
      throw new RequestError.BadRequestError('No users found');
    }

    return {
      ...paginatedRecord,
      results: paginatedRecord.results.map(UserMap.toDTO),
    };
  }

  async getById(id) {
    const userRecord = await this.userRepo.findById(id);

    if (!userRecord) {
      throw new RequestError.NotFoundError('User not found');
    }

    return UserMap.toDTO(userRecord);
  }

  async deleteById(id) {
    const userRecord = await this.userRepo.findById(id);

    if (!userRecord) {
      throw new RequestError.NotFoundError('User not found');
    }

    this.keystoreRepo.revokeAllByAccountId(userRecord.id);

    // TODO: Trigger full user cleanup including emails etc.
    // send delete user event job
    this.logger.info(`[Delete] - Start removal job for deleting: ${userRecord.email}`);
  }
}

export { AccountService };
