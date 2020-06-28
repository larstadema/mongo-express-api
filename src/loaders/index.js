import { expressLoader } from './express';
import { dependencyInjectorLoader } from './dependency-injector';
import { Logger } from './logger';
import { mongooseLoader } from './mongoose';
import { userRepo } from '../domains/users';

export const appLoader = async ({ expressApp }) => {
  await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  await dependencyInjectorLoader({
    repos: [
      {
        name: 'userRepo',
        repo: userRepo,
      },
    ],
  });
  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader(expressApp);
  Logger.info('✌️ Express loaded');
};
