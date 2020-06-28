import { Container } from 'typedi';
import cuid from 'cuid';

const resourceName = 'request-tracer';

/**
 * Monkey patches `.emit()` method of the given emitter, so
 * that all event listeners are run in scope of the provided
 * async resource.
 */
const wrapEmitter = (emitter, asyncResource) => {
  const original = emitter.emit;
  // eslint-disable-next-line no-param-reassign
  emitter.emit = (type, ...args) => asyncResource.runInAsyncScope(original, emitter, type, ...args);
};

const wrapHttpEmitters = (req, res, als) => {
  const asyncResource = als.createResource(resourceName);
  wrapEmitter(req, asyncResource);
  wrapEmitter(res, asyncResource);
};

/**
 * Generates a request tracer middleware for Express.
 *
 * @param {Object} options possible options
 * @param {boolean} options.useHeader respect request header flag
 *                                    (default: `false`)
 * @param {string} options.headerName request header name, used if `useHeader` is set to `true`
 *                                    (default: `X-Request-Id`)
 */
export const requestTracerMiddleware = ({
  useHeader = false,
  headerName = 'X-Request-Id',
} = {}) => {
  return (req, res, next) => {
    const als = Container.get('als');
    let requestId;
    if (useHeader) {
      requestId = req.headers[headerName.toLowerCase()];
    }
    requestId = requestId || cuid();

    als.handler.run(requestId, () => {
      wrapHttpEmitters(req, res, als);
      next();
    });
  };
};
