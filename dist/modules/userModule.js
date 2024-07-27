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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const ErrorHandler_1 = __importStar(require("../error/ErrorHandler"));
const errorCodes_1 = require("../error/errorCodes");
const nodemailer_1 = require("../utils/nodemailer");
const prismaInstance_1 = __importDefault(require("../utils/prismaInstance"));
dotenv_1.default.config();
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
class UserAuthModule {
    constructor() {
        this.login = catchAsync(async (req, res) => {
            const { email, password } = req.body;
            const user = await prismaInstance_1.default.user.findUnique({ where: { email } });
            if (!user) {
                const wrongUser = new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.wrongUser, 404);
                return ErrorHandler_1.default.handleErrors(wrongUser, req, res);
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                const wrongPass = new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.wrongPassword, 404);
                return ErrorHandler_1.default.handleErrors(wrongPass, req, res);
            }
            const secret = process.env.SUPABASE_JWT_SECRET;
            if (!secret) {
                const noSecret = new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.noSecret, 500);
                return ErrorHandler_1.default.handleErrors(noSecret, req, res);
            }
            //          SENDING JWT
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret, { expiresIn: '1min' });
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, secret, { expiresIn: '1d' });
            console.log(refreshToken);
            res
                .cookie('token', token, {
                httpOnly: true,
                // secure: true,
                // maxAge: 1000000,
                // signed: true,
            })
                .cookie('refreshToken', refreshToken);
            res.json({ status: 'success', token });
            console.log(user.email);
        });
        this.signUp = catchAsync(async (req, res) => {
            const { email, password } = req.body;
            console.log(email, password);
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const user = await prismaInstance_1.default.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });
            if (!user) {
                const newUserError = new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.newUserFail, 400);
                return ErrorHandler_1.default.handleErrors(newUserError, req, res);
            }
            res.status(200).json({ status: 'success', message: 'User was successfully created' });
        });
        this.signOut = catchAsync(async (_, res) => {
            res.clearCookie('token');
            res.clearCookie('refreshToken');
            res.status(200).json({ status: 'success', message: 'User was successfully logged out' });
        });
        this.requestNewToken = catchAsync(async (req, res) => {
            const refreshToken = req.cookies['refreshToken'];
            if (!refreshToken) {
                return ErrorHandler_1.default.handleErrors(new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.invalidToken, 400), req, res);
            }
            const secret = process.env.SUPABASE_JWT_SECRET;
            if (!secret) {
                return ErrorHandler_1.default.handleErrors(new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.noSecret, 400), req, res);
            }
            const decodedToken = jsonwebtoken_1.default.verify(refreshToken, secret);
            const user = await prismaInstance_1.default.user.findUnique({ where: { id: decodedToken.userId } });
            if (!user) {
                return ErrorHandler_1.default.handleErrors(new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.invalidToken, 400), req, res);
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret, { expiresIn: '1h' });
            res.header('Authorization', token).send(user);
        });
        this.sendEmail = catchAsync(async (req, res) => {
            const { email } = req.body;
            const token = req.headers.authorization;
            if (token) {
                (0, nodemailer_1.sendEmail)({ recipient: email, subject: 'verify your email', token: token });
            }
            res.send(token);
        });
        this.resetPassword = catchAsync(async (req, res) => {
            const { email, newPassword } = req.body;
            const user = await prismaInstance_1.default.user.findUnique({ where: { email } });
            if (!user) {
                return ErrorHandler_1.default.handleErrors(new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.wrongUser, 400), req, res);
            }
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
            await prismaInstance_1.default.user.update({
                where: { email },
                data: { password: hashedPassword },
            });
            res.json({ message: 'Password reset successful' });
        });
        this.verifyEmail = catchAsync(async (req, res) => {
            const token = req.params.token;
            console.log(token);
            const secret = process.env.SUPABASE_JWT_SECRET;
            if (!secret) {
                return ErrorHandler_1.default.handleErrors(new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.noSecret, 400), req, res);
            }
            if (!token) {
                const noToken = new ErrorHandler_1.CustomError('Not authenticated', 404);
                return ErrorHandler_1.default.handleErrors(noToken, req, res);
            }
            const verifiedUSer = jsonwebtoken_1.default.verify(token, secret);
            console.log(verifiedUSer);
            const user = await prismaInstance_1.default.user.update({
                where: { id: verifiedUSer.userId },
                data: { emailVerified: true },
            });
            if (!user)
                return ErrorHandler_1.default.handleErrors(new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.invalidToken, 400), req, res);
            res.json({ message: 'Email verified', token, verifiedUSer, user });
        });
    }
}
exports.default = UserAuthModule;
