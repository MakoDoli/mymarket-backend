import { Router } from 'express';
import {
  signUp,
  signIn,
  resetPassword,
  verifyEmail,
  sendEmail,
  requestNewToken,
  signOut,
} from '../controllers/userContoller';
import { validateRequest } from '../middleware/validateRequest';
import {
  signUpSchema,
  signInSchema,
  resetPasswordSchema,
  sendEmailSchema,
} from '../validators/userValidators';
import verifyToken from '../middleware/verifyToken';

const router = Router();

router.post('/signup', validateRequest(signUpSchema), signUp);

router.post('/signin', validateRequest(signInSchema), signIn);

router.post('/signout', signOut);

router.post('/refresh', requestNewToken);

router.post('/verify-email', validateRequest(sendEmailSchema), sendEmail);

router.get('/verify-email/:token', verifyEmail);

router.post('/reset-password', verifyToken, validateRequest(resetPasswordSchema), resetPassword);

router.get('/check-auth', verifyToken, (_, res) => {
  res.status(200).json({ status: 'ok', message: 'User is authenticated', authenticated: true });
});

export default router;
