import Container from 'typedi';
import { expressLoader } from './express';
import { dependencyInjectorLoader } from './dependency-injector';
import { Logger } from './logger';
import { mongooseLoader } from './mongoose';
import { userRepo, keystoreRepo, AccountService } from '../domains/accounts';
import { redisLoader } from './redis';

export const appLoader = async ({ expressApp }) => {
  await mongooseLoader();
  Logger.info('✌️  DB loaded and connected!');

  await redisLoader();
  Logger.info('✌️  Redis loaded and connected!');

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
    ]
  });
  Logger.info('✌️  Dependency Injector loaded');

  Container.set('AccountService', new AccountService(Container));

  Logger.info('✌️  Services loaded');
  await expressLoader(expressApp);
  Logger.info('✌️  Express loaded');
};
