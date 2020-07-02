import { UserRepo } from './user';
import { userModel, keystoreModel } from '../models';
import { KeystoreRepo } from './keystore';

const userRepo = new UserRepo(userModel);
const keystoreRepo = new KeystoreRepo(keystoreModel);

export { userRepo, keystoreRepo };
