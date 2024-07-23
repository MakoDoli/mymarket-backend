import { NextFunction, Request, Response } from 'express';
import UserAuthModule from '../modules/userModule.js';

const userAuthModule = new UserAuthModule();

export default class UserAuthService {
  login(req: Request, res: Response, next: NextFunction) {
    userAuthModule.login(req, res, next);
  }
  signup(req: Request, res: Response, next: NextFunction) {
    userAuthModule.signUp(req, res, next);
  }
  requestNewToken(req: Request, res: Response, next: NextFunction) {
    userAuthModule.requestNewToken(req, res, next);
  }
  resetPassword(req: Request, res: Response, next: NextFunction) {
    userAuthModule.resetPassword(req, res, next);
  }
  sendEmail(req: Request, res: Response, next: NextFunction) {
    userAuthModule.sendEmail(req, res, next);
  }
  verifyEmail(req: Request, res: Response, next: NextFunction) {
    userAuthModule.verifyEmail(req, res, next);
  }
}
