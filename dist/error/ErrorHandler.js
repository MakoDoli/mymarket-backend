"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandler {
    constructor() { }
    static notFound(req, res, next) {
        res.status(404).json({
            status: 'fail',
            message: `Can not find ${req.originalUrl} on this server`,
        });
        next();
    }
    static handleErrors(err, _, res, next) {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';
        res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
        });
        next();
    }
    static unCaughtException(err) {
        console.error('Uncaught exception ' + err);
        process.exit(1);
    }
    static unHandledRejection(err) {
        console.error(`Unhandled rejection occuered! ${err} Shutting down! `);
        process.exit(1);
    }
}
exports.default = ErrorHandler;
