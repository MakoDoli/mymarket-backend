import { NextFunction, Response, Request } from 'express';

export default class ErrorHandler {
  constructor() {}

  static notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404).json({
      status: 'fail',
      message: `Can not find ${req.originalUrl} on this server`,
    });
    next();
  }
  static handleErrors(err: any, _: Request, res: Response, next: NextFunction): void {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
    next();
  }

  static unCaughtException(err: Error) {
    console.error('Uncaught exception ' + err);
    process.exit(1);
  }

  static unHandledRejection(err: Error) {
    console.error(`Unhandled rejection occuered! ${err} Shutting down! `);
    process.exit(1);
  }
}
