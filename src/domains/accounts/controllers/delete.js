import { Container } from 'typedi';
import { isValidObjectId } from 'mongoose';
import { AccountService } from '../services';
import { RequestError } from '../../../core/api-error';
import { Roles } from '../../../core/roles';
import { SuccessMsgResponse } from '../../../core/api-response';

export const deleteById = async (req, res) => {
  const logger = Container.get('logger');
  const accountServiceInstance = Container.get(AccountService);

  logger.silly('Calling deleteById endpoint');

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw RequestError.BadRequestError('Invalid id');
  }

  const isAdmin = req.user.roles.some((role) => role === Roles.Admin);

  if (req.user.id !== id && !isAdmin) {
    throw RequestError.UnauthorizedError('Not authorized');
  }

  await accountServiceInstance.deleteById(id);

  new SuccessMsgResponse(
    'Sad to see you go, account removal started. Check email for more information'
  ).send(res);
};
