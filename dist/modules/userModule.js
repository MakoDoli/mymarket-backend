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
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
class UserAuthModule {
    constructor() { }
    async login(req, res) {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            //return res.status(401).json({ error: 'Invalid credentials' });
            const wrongUser = new ErrorHandler_1.CustomError(`User ${req.body.email} not found`, 404);
            return ErrorHandler_1.default.handleErrors(wrongUser, req, res);
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            //return res.status(401).json({ error: 'Invalid credentials' });
            const wrongPass = new ErrorHandler_1.CustomError('Invalid user or password', 404);
            return ErrorHandler_1.default.handleErrors(wrongPass, req, res);
        }
        const secret = process.env.SUPABASE_JWT_SECRET;
        if (!secret) {
            const noSecret = new ErrorHandler_1.CustomError('SUPABASE_JWT_SECRET is not defined in environment variables', 500);
            return ErrorHandler_1.default.handleErrors(noSecret, req, res);
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            // secure: true,
            // maxAge: 1000000,
            // signed: true,
        });
        res.json({ token });
    }
    async signUp(req, res) {
        const { email, password } = req.body;
        console.log(email, password);
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });
            // Send verification email logic here
            res.status(201).json({ message: 'User created', user });
        }
        catch (error) {
            res.status(400).json({ error: "Couldn't create new user" });
        }
    }
    async resetPassword(req, res) {
        const { email, newPassword } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });
        res.json({ message: 'Password reset successful' });
    }
    async verifyEmail(req, res) {
        const { token } = req.params;
        try {
            const secret = process.env.SUPABASE_JWT_SECRET;
            if (!secret) {
                throw new Error('SUPABASE_JWT_SECRET is not defined in environment variables');
            }
            const verifiedUSer = jsonwebtoken_1.default.verify(token, secret);
            const user = await prisma.user.update({
                where: { id: verifiedUSer.userId },
                data: { emailVerified: true },
            });
            if (user)
                res.json({ message: 'Email verified' });
        }
        catch (error) {
            res.status(400).json({ error: 'Invalid token' });
        }
    }
}
exports.default = UserAuthModule;
