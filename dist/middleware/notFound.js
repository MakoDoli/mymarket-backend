"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = () => {
    return (req, res, next) => {
        res.status(404).json({
            status: 'fail',
            message: `Can not find ${req.originalUrl}`,
        });
        next();
    };
};
exports.notFound = notFound;
