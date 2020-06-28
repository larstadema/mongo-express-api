import { Container } from 'typedi';
import { AuthService } from '../services';

export const signIn = async (req, res) => {
  const logger = Container.get('logger');
  const authServiceInstance = Container.get(AuthService);

  logger.silly('Calling Sign-In endpoint');

  const { email, password } = req.body;
  const { user, token } = await authServiceInstance.SignIn(email, password);

  return res.json({ user, token }).status(200);
};
