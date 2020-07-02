import { Container } from 'typedi';
import { isValidObjectId } from 'mongoose';
import { AccountService } from '../services';
import { RequestError } from '../../../core/api-error';
import { Roles } from '../../../core/roles';
import { SuccessMsgResponse } from '../../../core/api-response';

export const deleteById = async (req, res) => {
  const logger = Container.get('logger');
  const authServiceInstance = Container.get(AccountService);

  logger.silly('Calling deleteById endpoint');

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new RequestError.BadRequestError('Invalid id');
  }

  if (req.user.id !== id && req.user.role !== Roles.Admin) {
    throw new RequestError.UnauthorizedError('Not authorized');
  }

  await authServiceInstance.deleteById(id);

  new SuccessMsgResponse(
    'Sad to see you go, account removal started. Check email for more information'
  ).send(res);
};
