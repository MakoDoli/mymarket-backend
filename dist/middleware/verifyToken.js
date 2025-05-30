"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandler_1 = __importStar(require("../error/ErrorHandler"));
const prismaInstance_1 = __importDefault(require("../utils/prismaInstance"));
const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!token) {
        const noTokenError = new ErrorHandler_1.CustomError('Token not provided', 401);
        return ErrorHandler_1.default.handleErrors(noTokenError, req, res);
    }
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
        const noSecretError = new ErrorHandler_1.CustomError('JWT secret not set', 500);
        return ErrorHandler_1.default.handleErrors(noSecretError, req, res);
    }
    try {
        jsonwebtoken_1.default.verify(token, secret);
        // const decoded = jwt.verify(token, secret) as { userId: string };
        //req.userId = decoded.userId;
        return next();
    }
    catch (err) {
        console.log('REFRESHTOKEN ERROR STARTS HERE 💥 ' + err);
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError && refreshToken) {
            console.log('JWT EXPIRED ERROR STARTS HERE 🥶 ');
            try {
                const decodedToken = jsonwebtoken_1.default.verify(refreshToken, secret);
                const user = await prismaInstance_1.default.user.findUnique({ where: { id: decodedToken.userId } });
                if (!user) {
                    const userNotFoundError = new ErrorHandler_1.CustomError('User not found', 404);
                    return ErrorHandler_1.default.handleErrors(userNotFoundError, req, res);
                }
                const newToken = jsonwebtoken_1.default.sign({ userId: user.id }, secret, { expiresIn: '1min' });
                const newRefreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, secret, { expiresIn: '1h' });
                console.log('NEW TOKEN 🎀 ' + token);
                res
                    .cookie('token', newToken, {
                    httpOnly: true,
                })
                    .cookie('refreshToken', newRefreshToken);
                // res.header('Authorization', 'Bearer ' + newRefreshToken);
                //req.userId = user.id;
                return next();
            }
            catch (refreshErr) {
                const invalidRefreshTokenError = new ErrorHandler_1.CustomError('Invalid or expired refresh token', 401);
                return ErrorHandler_1.default.handleErrors(invalidRefreshTokenError, req, res);
            }
        }
        else {
            const invalidTokenError = new ErrorHandler_1.CustomError('Invalid or expired token', 401);
            return ErrorHandler_1.default.handleErrors(invalidTokenError, req, res);
        }
    }
};
exports.default = verifyToken;
