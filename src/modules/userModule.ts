import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ErrorHandler, { CustomError } from '../error/ErrorHandler';
import { ERROR_CODES } from '../error/errorCodes';
import { sendEmail } from '../utils/nodemailer';
import prisma from '../utils/prismaInstance';
dotenv.config();

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const catchAsync = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default class UserAuthModule {
  constructor() {}

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const wrongUser = new CustomError(ERROR_CODES.wrongUser, 404);
      return ErrorHandler.handleErrors(wrongUser, req, res);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const wrongPass = new CustomError(ERROR_CODES.wrongPassword, 404);
      return ErrorHandler.handleErrors(wrongPass, req, res);
    }
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      const noSecret = new CustomError(ERROR_CODES.noSecret, 500);
      return ErrorHandler.handleErrors(noSecret, req, res);
    }

    //          SENDING JWT

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1min' });
    const refreshToken = jwt.sign({ userId: user.id }, secret, { expiresIn: '1d' });
    console.log(refreshToken);
    res
      .cookie('token', token, {
        httpOnly: true,
      })
      .cookie('refreshToken', refreshToken);
    res.json({ status: 'success', token });
    console.log(user.email);
  });

  signUp = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(email, password);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    if (!user) {
      const newUserError = new CustomError(ERROR_CODES.newUserFail, 400);
      return ErrorHandler.handleErrors(newUserError, req, res);
    }
    res.status(200).json({ status: 'success', message: 'User was successfully created' });
  });

  signOut = catchAsync(async (_: Request, res: Response) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.status(200).json({ status: 'success', message: 'User was successfully logged out' });
  });

  requestNewToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return ErrorHandler.handleErrors(new CustomError(ERROR_CODES.invalidToken, 400), req, res);
    }

    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      return ErrorHandler.handleErrors(new CustomError(ERROR_CODES.noSecret, 400), req, res);
    }
    const decodedToken = jwt.verify(refreshToken, secret) as { userId: number };
    const user = await prisma.user.findUnique({ where: { id: decodedToken.userId } });
    if (!user) {
      return ErrorHandler.handleErrors(new CustomError(ERROR_CODES.invalidToken, 400), req, res);
    }
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
    res.header('Authorization', token).send(user);
  });

  sendEmail = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const token = req.cookies.token;

    if (token) {
      sendEmail({ recipient: email, subject: 'verify your email', token: token });
    }
    res.send(token);
  });

  resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return ErrorHandler.handleErrors(new CustomError(ERROR_CODES.wrongUser, 400), req, res);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    res.json({ message: 'Password reset successful' });
  });

  verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const token = req.params.token;
    console.log(token);

    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      return ErrorHandler.handleErrors(new CustomError(ERROR_CODES.noSecret, 400), req, res);
    }
    if (!token) {
      const noToken = new CustomError('Not authenticated', 404);
      return ErrorHandler.handleErrors(noToken, req, res);
    }
    const verifiedUSer = jwt.verify(token, secret) as { userId: number };
    console.log(verifiedUSer);

    const user = await prisma.user.update({
      where: { id: verifiedUSer.userId },
      data: { emailVerified: true },
    });
    if (!user)
      return ErrorHandler.handleErrors(new CustomError(ERROR_CODES.invalidToken, 400), req, res);
    res.json({ message: 'Email verified', token, verifiedUSer, user });
  });
}
