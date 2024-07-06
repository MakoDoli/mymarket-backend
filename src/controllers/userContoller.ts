import { Request, Response } from 'express';
import dotenv from 'dotenv';
import UserAuthService from '../service/userAuthService.js';

dotenv.config();

const authService = new UserAuthService();

export async function signIn(req: Request, res: Response) {
  authService.login(req, res);
}

export async function signUp(req: Request, res: Response) {
  authService.signup(req, res);
}
export async function requestNewToken(req: Request, res: Response) {
  authService.requestNewToken(req, res);
}

export async function resetPassword(req: Request, res: Response) {
  authService.resetPassword(req, res);
}
export async function verifyEmail(req: Request, res: Response) {
  authService.verifyEmail(req, res);
}
export async function sendEmail(req: Request, res: Response) {
  authService.sendEmail(req, res);
}
