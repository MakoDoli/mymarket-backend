import { Router } from 'express';
import {
  signUp,
  signIn,
  resetPassword,
  verifyEmail,
  sendEmail,
  requestNewToken,
} from '../controllers/userContoller';
import { validateRequest } from '../middleware/validateRequest';
import {
  signUpSchema,
  signInSchema,
  resetPasswordSchema,
  sendEmailSchema,
} from '../validators/userValidators';

const router = Router();

router.post('/signup', validateRequest(signUpSchema), signUp);

router.post('/signin', validateRequest(signInSchema), signIn);

router.post('/refresh', requestNewToken);

router.post('/verify-email', validateRequest(sendEmailSchema), sendEmail);

router.get('/verify-email/:token', verifyEmail);

router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);

export default router;
