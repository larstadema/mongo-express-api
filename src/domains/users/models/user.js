import { model, Schema } from 'mongoose';

const User = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },

    password: String,

    salt: String,

    role: {
      type: String,
      default: 'user',
    },
  },
  { timestamps: true }
);

export const userModel = model('User', User);
