import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import UserAuthService from '../service/userAuthService.js';

dotenv.config();

const authService = new UserAuthService();

export async function signIn(req: Request, res: Response, next: NextFunction) {
  authService.login(req, res, next);
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
  authService.signup(req, res, next);
}
export async function requestNewToken(req: Request, res: Response, next: NextFunction) {
  authService.requestNewToken(req, res, next);
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  authService.resetPassword(req, res, next);
}
export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  authService.verifyEmail(req, res, next);
}
export async function sendEmail(req: Request, res: Response, next: NextFunction) {
  authService.sendEmail(req, res, next);
}
