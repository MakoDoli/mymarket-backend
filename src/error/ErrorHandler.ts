import { NextFunction, Response, Request } from 'express';
export class CustomError extends Error {
  status: string;
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = this.statusCode >= 400 && this.statusCode < 500 ? 'fail' : 'error';
  }
}
export default class ErrorHandler {
  constructor() {}

  static notFound(req: Request, _: Response, next: NextFunction) {
    const err = new CustomError(`Can not find ${req.originalUrl} on this server`, 400);

    next(err);
  }

  // static userNotFound(req: Request, _: Response, next: NextFunction) {
  //   const err = new CustomError(`User ${req.body.email} not found`, 404);

  //   next(err);
  // }

  static handleErrors(err: CustomError, _: Request, res: Response, next?: NextFunction): void {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
    });
    if (next) next();
  }

  static unCaughtException(err: Error) {
    console.error('Uncaught exception ' + err);
    process.exit(1);
  }

  static unHandledRejection(err: Error) {
    console.error(`Unhandled rejection occurred! ${err} Shutting down! `);
    process.exit(1);
  }
}
