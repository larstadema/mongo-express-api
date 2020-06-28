import { UserMap } from '../mappers';

export class UserRepo {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async findUserByEmail(email) {
    const userRecord = await this.userModel.findOne({ email });

    if (!!userRecord) {
      return userRecord;
    }

    return null;
  }

  async exists(email) {
    const userRecord = await this.userModel.findOne({ email });

    return !!userRecord;
  }

  async save(user) {
    const exists = this.exists(user.email);
    const rawUser = UserMap.toPersistence(user);

    if (!exists) {
      await this.userModel.create(rawUser);
    } else {
      await this.userModel.findOneAndModify({ email: user.email }, rawUser);
    }
  }
}
