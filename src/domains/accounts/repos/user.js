import { UserMap } from '../mappers';
import { generateQuery, generateSort, prepareResponse } from '../../../utils/pagination';

export class UserRepo {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async findByEmail(email) {
    const userRecord = await this.userModel.findOne({ email });

    if (!!userRecord) {
      return UserMap.toDomain(userRecord);
    }

    return null;
  }

  async findById(id) {
    const userRecord = await this.userModel.findById(id);

    if (!!userRecord) {
      return UserMap.toDomain(userRecord);
    }

    return null;
  }

  async findByResetToken(token) {
    const userRecord = await this.userModel.findOne({
      'resetToken.token': token,
      'resetToken.expires': { $gt: Date.now() },
    });

    if (!!userRecord) {
      return UserMap.toDomain(userRecord);
    }

    return null;
  }

  async findByVerificationToken(token) {
    const userRecord = await this.userModel.findOne({
      verificationToken: token,
    });

    if (!!userRecord) {
      return UserMap.toDomain(userRecord);
    }

    return null;
  }

  async findByPagination({ limit, previous, next, sortAscending, query = {} }) {
    const totalCount = await this.userModel.estimatedDocumentCount();

    const rootQuery = generateQuery({
      next,
      previous,
      sortAscending,
    });

    const sort = generateSort({
      previous,
      sortAscending,
    });

    const result = await this.userModel
      .find({ $and: [rootQuery, query] })
      .sort(sort)
      .limit(limit + 1);

    const response = prepareResponse(result, { limit, next, previous });

    return {
      ...response,
      results: response.results.map(UserMap.toDomain),
      totalCount,
    };
  }

  async exists(email) {
    const userRecord = await this.userModel.findOne({ email });

    return !!userRecord;
  }

  async save(user) {
    const exists = await this.exists(user.email);
    const rawUser = await UserMap.toPersistence(user);

    if (!exists) {
      const userRecord = await this.userModel.create(rawUser);

      return UserMap.toDomain(userRecord);
    }

    const userRecord = await this.userModel.findOneAndUpdate(
      { email: user.email },
      { ...rawUser, updatedAt: Date.now() },
      { new: true }
    );

    return UserMap.toDomain(userRecord);
  }

  async delete(id) {
    const userRecord = await this.findById(id);

    if (!userRecord) {
      return null;
    }

    return this.userRepo.deleteOne({ id });
  }
}
