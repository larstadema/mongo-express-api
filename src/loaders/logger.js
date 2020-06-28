import appRoot from 'app-root-path';
import winston from 'winston';
import { AsyncLocalStorageInstance } from './async-local-storage';
import config from '../config';

const formatter = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.splat(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    const rid = AsyncLocalStorageInstance.id();
    const requestId = rid ? `[request-id:${rid}] ` : '';

    return `${timestamp} ${requestId}[${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`;
  })
);

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: config.logs.level,
    handleExceptions: true,
    json: false,
    colorize: true,
    format: formatter,
  },
};

// instantiate a new Winston Logger with the settings defined above
const Logger = winston.createLogger({
  transports: [
    process.env.NODE_ENV === 'production'
      ? new winston.transports.File(options.file)
      : new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
Logger.stream = {
  write: (message) => {
    // use the 'info' log level so the output will be picked up by both transports
    Logger.info(message);
  },
};

export { Logger };
