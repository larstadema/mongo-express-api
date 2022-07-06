import { Container } from 'typedi';
import { Logger as LoggerInstance } from './logger';
import { AsyncLocalStorageInstance } from './async-local-storage';

// import agendaFactory from './agenda';
// import config from '../config';
// import mailgun from 'mailgun-js';

export const dependencyInjectorLoader = async ({ repos }) => {
  try {
    repos.forEach((m) => {
      Container.set(m.name, m.repo);
    });

    // const agendaInstance = agendaFactory({ mongoConnection });

    // Container.set('agendaInstance', agendaInstance);
    Container.set('logger', LoggerInstance);
    Container.set('als', AsyncLocalStorageInstance);
    // Container.set('emailClient', mailgun({ apiKey: config.emails.apiKey, domain: config.emails.domain }))

    // LoggerInstance.info('✌️ Agenda injected into container');

    // return { agenda: agendaInstance };
    return Promise.resolve();
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
