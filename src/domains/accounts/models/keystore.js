import { model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'Keystore';
export const COLLECTION_NAME = 'keystores';

const Keystore = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: {
    type: String,
    required: true,
  },
  accessTokenKey: {
    type: String,
    required: true,
  },
  expires: Date,
  created: { type: Date, default: Date.now },
  createdByIp: String,
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String,
});

// eslint-disable-next-line func-names
Keystore.virtual('isExpired').get(function () {
  return Date.now() >= this.expires;
});

// eslint-disable-next-line func-names
Keystore.virtual('isActive').get(function () {
  return !this.revoked && !this.isExpired;
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

Keystore.set('toObject', convertOptions);

Keystore.set('toJSON', convertOptions);

Keystore.index({ user: 1, refreshToken: 1 });
Keystore.index({ user: 1, refreshToken: 1, accessTokenKey: 1 });
Keystore.index(
  { user: 1, revoked: 1 },
  { partialFilterExpression: { revoked: { $exists: false } } }
);

export const keystoreModel = model(DOCUMENT_NAME, Keystore, COLLECTION_NAME);
