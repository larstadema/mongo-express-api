import { connect } from 'mongoose';
import config from '../config';

export const mongooseLoader = async () => {
  const connection = await connect(config.databaseURL);
  return connection.connection.db;
};
