import { Container } from 'typedi';
import { isValidObjectId } from 'mongoose';
import { AccountService } from '../services';
import { RequestError } from '../../../core/api-error';
import { Roles } from '../../../core/roles';
import { SuccessResponse } from '../../../core/api-response';

export const getById = async (req, res) => {
  const logger = Container.get('logger');
  const authServiceInstance = Container.get(AccountService);

  logger.silly('Calling getById endpoint');

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new RequestError.BadRequestError('Invalid id');
  }

  if (req.user.id !== id && req.user.role !== Roles.Admin) {
    throw new RequestError.UnauthorizedError('Not authorized');
  }

  const user = await authServiceInstance.getById(id);

  new SuccessResponse('success', user).send(res);
};
