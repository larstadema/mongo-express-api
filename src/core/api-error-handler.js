import { RequestError } from './api-error';
import { Logger } from '../loaders/logger';

export class ErrorHandler {
  static async handleError(err, context, errorId) {
    const errorIdLog = errorId ? ` - [error-id:${errorId}]` : '';
    Logger.error(`${err.statusCode}${errorIdLog} - ${err.message}`, context);

    // !!! setup additional logging actions like:
    // await sendMailToAdminIfCritical();
    // await sendEventsToSentry();
  }

  static isTrustedError(error) {
    if (error instanceof RequestError) {
      return error.isOperational;
    }
    return false;
  }
}
