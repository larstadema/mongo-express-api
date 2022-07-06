import { Container } from 'typedi';
import { isValidObjectId } from 'mongoose';
import { RequestError } from '../../../core/api-error';
import { Roles } from '../../../core/roles';
import { SuccessResponse } from '../../../core/api-response';

export const getById = async (req, res) => {
  const logger = Container.get('logger');
  const accountServiceInstance = Container.get('AccountService');

  logger.silly('Calling getById endpoint');

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw RequestError.BadRequestError('Invalid id');
  }

  const isAdmin = req.user.roles.some((role) => role === Roles.Admin);

  if (req.user.id !== id && !isAdmin) {
    throw RequestError.UnauthorizedError('Not authorized');
  }

  const user = await accountServiceInstance.getById(id);

  new SuccessResponse('success', user).send(res);
};
