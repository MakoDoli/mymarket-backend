"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.verifyEmail = exports.resetPassword = exports.requestNewToken = exports.signUp = exports.signIn = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const userAuthService_js_1 = __importDefault(require("../service/userAuthService.js"));
dotenv_1.default.config();
const authService = new userAuthService_js_1.default();
async function signIn(req, res) {
    authService.login(req, res);
}
exports.signIn = signIn;
async function signUp(req, res) {
    authService.signup(req, res);
}
exports.signUp = signUp;
async function requestNewToken(req, res) {
    authService.requestNewToken(req, res);
}
exports.requestNewToken = requestNewToken;
async function resetPassword(req, res) {
    authService.resetPassword(req, res);
}
exports.resetPassword = resetPassword;
async function verifyEmail(req, res) {
    authService.verifyEmail(req, res);
}
exports.verifyEmail = verifyEmail;
async function sendEmail(req, res) {
    authService.sendEmail(req, res);
}
exports.sendEmail = sendEmail;
