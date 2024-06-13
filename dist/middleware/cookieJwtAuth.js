"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieJwtAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const secret = process.env.SUPABASE_JWT_SECRET;
        if (!secret) {
            throw new Error("SUPABASE_JWT_SECRET is not defined in environment variables");
        }
        const user = jsonwebtoken_1.default.verify(token, secret);
        req.user = user;
        next();
    }
    catch (err) {
        res.clearCookie("token");
        return res.status(400).json({ error: "No cookies sent" });
    }
};
exports.cookieJwtAuth = cookieJwtAuth;
