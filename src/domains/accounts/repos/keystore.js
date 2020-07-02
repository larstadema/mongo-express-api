import { KeystoreMap } from '../mappers';

export class KeystoreRepo {
  constructor(keystoreModel) {
    this.keystoreModel = keystoreModel;
  }

  async findByToken(refreshToken) {
    const keystoreRecord = await this.keystoreModel
      .findOne({ refreshToken, revoked: { $exists: false } })
      .populate('user');

    if (!!keystoreRecord) {
      return KeystoreMap.toDomain(keystoreRecord);
    }

    return null;
  }

  async find(userId, refreshToken, accessTokenKey) {
    const keystoreRecord = await this.keystoreModel
      .findOne({ user: userId, refreshToken, accessTokenKey })
      .populate('user');

    if (!!keystoreRecord) {
      return KeystoreMap.toDomain(keystoreRecord);
    }

    return null;
  }

  async getTokensByAccountId(userId) {
    const keystoreRecords = await this.keystoreModel
      .find({ user: userId, revoked: { $exists: false } })
      .populate('user');

    if (keystoreRecords && keystoreRecords.length) {
      return keystoreRecords.map((r) => r.refreshToken);
    }

    return null;
  }

  async GetByAccountIdAndAccessKey(userId, accessTokenKey) {
    const keystoreRecord = await this.keystoreModel.findOne({
      user: userId,
      accessTokenKey,
      revoked: { $exists: false },
    });

    if (!!keystoreRecord) {
      return KeystoreMap.toDomain(keystoreRecord);
    }

    return null;
  }

  async revokeAllByAccountId(userId, ipAddress) {
    const keystoreRecords = await this.keystoreModel.find({
      user: userId,
      revoked: { $exists: false },
    });

    if (keystoreRecords.length) {
      await this.keystoreModel.updateMany(
        { user: userId },
        { revoked: Date.now(), revokedByIp: ipAddress, replacedByToken: undefined }
      );
    }
  }

  async revokeByToken(oldToken, newToken, ipAddress) {
    const keystoreRecord = await this.keystoreModel.findOne({ refreshToken: oldToken });

    if (keystoreRecord) {
      await this.keystoreModel.updateOne(
        { refreshToken: oldToken },
        { revoked: Date.now(), revokedByIp: ipAddress, replacedByToken: newToken }
      );
    }
  }

  async exists(refreshToken) {
    const keystoreRecord = await this.keystoreModel.findOne({ refreshToken });

    return !!keystoreRecord;
  }

  async save(keystore) {
    const rawKeystore = await KeystoreMap.toPersistence(keystore);

    const keystoreRecord = await this.keystoreModel.create(rawKeystore);

    return KeystoreMap.toDomain(keystoreRecord);
  }

  async delete(id) {
    const keystoreRecord = await this.keystoreModel.findOne({ id });

    if (!keystoreRecord) {
      return null;
    }

    return this.keystoreModel.deleteOne({ id });
  }
}
