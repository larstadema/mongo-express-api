import { AsyncLocalStorage, AsyncResource } from 'async_hooks';

const als = new AsyncLocalStorage();

export const AsyncLocalStorageInstance = {
  handler: als,
  id: () => als.getStore(),
  createResource: (resourceName) => new AsyncResource(resourceName),
};
