import { Request, Response } from "express";
import UserAuthModule from "../modules/userModule.js";

const userAuthModule = new UserAuthModule();

export default class UserAuthService {
  login(req: Request, res: Response) {
    userAuthModule.login(req, res);
  }
  signup(req: Request, res: Response) {
    userAuthModule.signUp(req, res);
  }
  resetPassword(req: Request, res: Response) {
    userAuthModule.resetPassword(req, res);
  }
  verifyEmail(req: Request, res: Response) {
    userAuthModule.verifyEmail(req, res);
  }
}
