"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = this.statusCode >= 400 && this.statusCode < 500 ? 'fail' : 'error';
    }
}
class ErrorHandler {
    constructor() { }
    static notFound(req, _, next) {
        const err = new CustomError(`Can not find ${req.originalUrl} on this server`, 404);
        next(err);
    }
    static userNotFound(req, _, next) {
        const err = new CustomError(`User ${req.body.email} not found`, 404);
        next(err);
    }
    static handleErrors(err, _, res, next) {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';
        res.status(err.statusCode).json({
            status: err.status,
            statusCode: err.statusCode,
            message: err.message,
        });
        next();
    }
    static unCaughtException(err) {
        console.error('Uncaught exception ' + err);
        process.exit(1);
    }
    static unHandledRejection(err) {
        console.error(`Unhandled rejection occurred! ${err} Shutting down! `);
        process.exit(1);
    }
}
exports.default = ErrorHandler;
