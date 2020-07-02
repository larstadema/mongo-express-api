import http from 'http';
import express from 'express';
import { createTerminus } from '@godaddy/terminus';
import config from './config';
import { appLoader } from './loaders';
import { Logger } from './loaders/logger';
import { RequestError } from './core/api-error';
import { ErrorHandler } from './core/api-error-handler';

const startServer = async () => {
  const app = express();

  await appLoader({ expressApp: app });

  const server = http.createServer(app);

  const onSignal = () => {
    Logger.info('server is starting cleanup');

    return Promise.all([]);
  };

  const onShutdown = () => {
    Logger.info('Cleanup finished, server is shutting down');
  };

  const healthCheck = () => {
    // optionally include a resolve value to be included as
    // info in the health check response
    const uptime = process.uptime();

    return Promise.resolve({ uptime });
  };

  const options = {
    // health check options
    healthChecks: {
      '/status/health': healthCheck, // a function returning a promise indicating service health,
      verbatim: true,
    },
    // cleanup options
    timeout: 1000, // [optional = 1000] number of milliseconds before forceful exiting
    onSignal, // [optional] cleanup function, returning a promise (used to be onSigterm)
    onShutdown, // [optional] called right before exiting
  };

  createTerminus(server, options);

  server.listen(config.port);

  const onListening = () => {
    Logger.info(`
      #################################################
      🛡️      Listening at http://localhost:${config.port}      🛡️ 
      #################################################
    `);
  };

  server.on('listening', onListening);

  process.on('unhandledRejection', (reason) => {
    throw reason;
  });

  process.on('uncaughtException', (error) => {
    const isTrustedError = ErrorHandler.isTrustedError(error);

    ErrorHandler.handleError(
      isTrustedError ? error : new RequestError.InternalServerError('Uncaught Exception')
    );

    if (!isTrustedError) {
      process.exit(1);
    }
  });
};

startServer();
