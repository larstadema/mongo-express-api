import { expressLoader } from './express';
import { dependencyInjectorLoader } from './dependency-injector';
import { Logger } from './logger';
import { mongooseLoader } from './mongoose';
import { userRepo, keystoreRepo } from '../domains/accounts';

export const appLoader = async ({ expressApp }) => {
  await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  await dependencyInjectorLoader({
    repos: [
      {
        name: 'userRepo',
        repo: userRepo,
      },
      {
        name: 'keystoreRepo',
        repo: keystoreRepo,
      },
    ],
  });
  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader(expressApp);
  Logger.info('✌️ Express loaded');
};
