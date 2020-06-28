import { Container } from 'typedi';
import { AuthService } from '../services/auth';

export const signUp = async (req, res) => {
  const logger = Container.get('logger');
  const authServiceInstance = Container.get(AuthService);

  logger.silly('Calling Sign-Up endpoint');

  const { user, token } = await authServiceInstance.SignUp(req.body);

  return res.status(201).json({ user, token });
};
