var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();
export default class UserAuthModule {
    constructor() { }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const isPasswordValid = yield bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const secret = process.env.SUPABASE_JWT_SECRET;
            if (!secret) {
                throw new Error("SUPABASE_JWT_SECRET is not defined in environment variables");
            }
            const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
            res.cookie("token", token, {
                httpOnly: true,
                // secure: true,
                // maxAge: 1000000,
                // signed: true,
            });
            res.json({ token });
        });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            console.log(email, password);
            const hashedPassword = yield bcrypt.hash(password, 10);
            try {
                const user = yield prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                    },
                });
                // Send verification email logic here
                res.status(201).json({ message: "User created", user });
            }
            catch (error) {
                res.status(400).json({ error: "Couldn't create new user" });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, newPassword } = req.body;
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }
            const hashedPassword = yield bcrypt.hash(newPassword, 10);
            yield prisma.user.update({
                where: { email },
                data: { password: hashedPassword },
            });
            res.json({ message: "Password reset successful" });
        });
    }
}
