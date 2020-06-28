import { connect } from 'mongoose';
import config from '../config';

export const mongooseLoader = async () => {
  const connection = await connect(config.databaseURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return connection.connection.db;
};
