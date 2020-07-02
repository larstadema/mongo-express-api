import morgan from 'morgan';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from '../api';
import * as middlewares from '../core/middlewares';
import { Logger } from './logger';
import config from '../config';

export const expressLoader = async (app) => {
  app.enable('trust proxy');

  app.use(helmet());
  app.use(morgan('combined', { stream: Logger.stream }));
  app.use(
    cors({
      origin: config.api.corsOrigin,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Make sure to inlclude last (over other 3rd party middlewares that might override/bind req/res)
  app.use(
    middlewares.requestTracer({
      useHeader: true,
      headerName: 'X-Request-Id',
    })
  );

  app.use(config.api.prefix, routes());

  app.use(middlewares.notFound);
  app.use(middlewares.error);
};
