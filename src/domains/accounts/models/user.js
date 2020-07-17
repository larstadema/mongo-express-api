import { model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

const User = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    index: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  passwordReset: Date,
  roles: {
    type: Array,
    default: ['user'],
    required: true,
  },
  profile: {
    firstName: String,
    lastName: String,
    displayName: String,
    avatar: String,
  },
  private: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verified: Date,
  resetToken: {
    token: String,
    expires: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

// eslint-disable-next-line func-names
User.virtual('isVerified').get(function () {
  return !!(this.verified || this.passwordReset);
});

const convertOptions = {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    // remove these props when object is serialized
    const { _id, ...obj } = ret;
    return obj;
  },
};

User.set('toObject', convertOptions);

User.set('toJSON', convertOptions);

export const userModel = model(DOCUMENT_NAME, User, COLLECTION_NAME);
