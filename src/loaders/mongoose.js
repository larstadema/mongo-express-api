import { connect } from 'mongoose';
import config from '../config';

export const mongooseLoader = async () => {
  const connection = await connect(config.databaseURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  return connection.connection.db;
};
