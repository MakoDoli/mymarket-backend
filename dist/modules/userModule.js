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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const ErrorHandler_1 = __importStar(require("../error/ErrorHandler"));
const errorCodes_1 = require("../error/errorCodes");
const nodemailer_1 = require("../utils/nodemailer");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
class UserAuthModule {
    constructor() { }
    async login(req, res) {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            //return res.status(401).json({ error: 'Invalid credentials' });
            const wrongUser = new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.wrongUser, 404);
            return ErrorHandler_1.default.handleErrors(wrongUser, req, res);
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            //return res.status(401).json({ error: 'Invalid credentials' });
            const wrongPass = new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.wrongPassword, 404);
            return ErrorHandler_1.default.handleErrors(wrongPass, req, res);
        }
        const secret = process.env.SUPABASE_JWT_SECRET;
        if (!secret) {
            const noSecret = new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.noSecret, 500);
            return ErrorHandler_1.default.handleErrors(noSecret, req, res);
        }
        //          SENDING JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            // secure: true,
            // maxAge: 1000000,
            // signed: true,
        });
        res.json({ token });
        console.log(user);
    }
    async signUp(req, res) {
        const { email, password } = req.body;
        console.log(email, password);
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        if (!user) {
            const newUserError = new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.newUserFail, 400);
            return ErrorHandler_1.default.handleErrors(newUserError, req, res);
        }
        res.status(400).json({ error: "Couldn't create new user" });
    }
    async sendEmail(req, res) {
        const { email } = req.body;
        const token = req.headers.authorization;
        if (token) {
            (0, nodemailer_1.sendEmail)({ recipient: email, subject: 'verify your email', token: token });
        }
        res.send(token);
    }
    async resetPassword(req, res) {
        const { email, newPassword } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return ErrorHandler_1.default.handleErrors(new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.wrongUser, 400), req, res);
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });
        res.json({ message: 'Password reset successful' });
    }
    async verifyEmail(req, res) {
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
        const user = await prisma.user.update({
            where: { id: verifiedUSer.userId },
            data: { emailVerified: true },
        });
        if (!user)
            return ErrorHandler_1.default.handleErrors(new ErrorHandler_1.CustomError(errorCodes_1.ERROR_CODES.invalidToken, 400), req, res);
        res.json({ message: 'Email verified', token, verifiedUSer, user });
    }
}
exports.default = UserAuthModule;
