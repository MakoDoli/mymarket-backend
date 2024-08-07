import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ErrorHandler, { CustomError } from '../error/ErrorHandler';
import prisma from '../utils/prismaInstance';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);

  if (!token) {
    const noTokenError = new CustomError('Token not provided', 401);
    return ErrorHandler.handleErrors(noTokenError, req, res);
  }

  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) {
    const noSecretError = new CustomError('JWT secret not set', 500);
    return ErrorHandler.handleErrors(noSecretError, req, res);
  }

  try {
    jwt.verify(token, secret);
    // const decoded = jwt.verify(token, secret) as { userId: string };
    //req.userId = decoded.userId;
    return next();
  } catch (err) {
    console.log('REFRESHTOKEN ERROR STARTS HERE 💥 ' + err);
    if (err instanceof jwt.TokenExpiredError && refreshToken) {
      console.log('JWT EXPIRED ERROR STARTS HERE 🥶 ');
      try {
        const decodedToken = jwt.verify(refreshToken, secret) as { userId: number };
        const user = await prisma.user.findUnique({ where: { id: decodedToken.userId } });

        if (!user) {
          const userNotFoundError = new CustomError('User not found', 404);
          return ErrorHandler.handleErrors(userNotFoundError, req, res);
        }

        const newToken = jwt.sign({ userId: user.id }, secret, { expiresIn: '1min' });
        const newRefreshToken = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
        console.log('NEW TOKEN 🎀 ' + token);
        res
          .cookie('token', newToken, {
            httpOnly: true,
          })
          .cookie('refreshToken', newRefreshToken);

        // res.header('Authorization', 'Bearer ' + newRefreshToken);

        //req.userId = user.id;
        return next();
      } catch (refreshErr) {
        const invalidRefreshTokenError = new CustomError('Invalid or expired refresh token', 401);
        return ErrorHandler.handleErrors(invalidRefreshTokenError, req, res);
      }
    } else {
      const invalidTokenError = new CustomError('Invalid or expired token', 401);
      return ErrorHandler.handleErrors(invalidTokenError, req, res);
    }
  }
};

export default verifyToken;
