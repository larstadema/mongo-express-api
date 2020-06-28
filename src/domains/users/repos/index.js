import { UserRepo } from './user';
import { userModel } from '../models';

const userRepo = new UserRepo(userModel);

export { userRepo };
