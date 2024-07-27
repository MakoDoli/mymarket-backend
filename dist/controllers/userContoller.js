"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.verifyEmail = exports.resetPassword = exports.requestNewToken = exports.signOut = exports.signUp = exports.signIn = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const userAuthService_js_1 = __importDefault(require("../service/userAuthService.js"));
dotenv_1.default.config();
const authService = new userAuthService_js_1.default();
async function signIn(req, res, next) {
    authService.login(req, res, next);
}
exports.signIn = signIn;
async function signUp(req, res, next) {
    authService.signup(req, res, next);
}
exports.signUp = signUp;
async function signOut(req, res, next) {
    authService.signOut(req, res, next);
}
exports.signOut = signOut;
async function requestNewToken(req, res, next) {
    authService.requestNewToken(req, res, next);
}
exports.requestNewToken = requestNewToken;
async function resetPassword(req, res, next) {
    authService.resetPassword(req, res, next);
}
exports.resetPassword = resetPassword;
async function verifyEmail(req, res, next) {
    authService.verifyEmail(req, res, next);
}
exports.verifyEmail = verifyEmail;
async function sendEmail(req, res, next) {
    authService.sendEmail(req, res, next);
}
exports.sendEmail = sendEmail;
