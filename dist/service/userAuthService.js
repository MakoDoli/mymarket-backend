"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModule_js_1 = __importDefault(require("../modules/userModule.js"));
const userAuthModule = new userModule_js_1.default();
class UserAuthService {
    login(req, res) {
        userAuthModule.login(req, res);
    }
    signup(req, res) {
        userAuthModule.signUp(req, res);
    }
    requestNewToken(req, res) {
        userAuthModule.requestNewToken(req, res);
    }
    resetPassword(req, res) {
        userAuthModule.resetPassword(req, res);
    }
    sendEmail(req, res) {
        userAuthModule.sendEmail(req, res);
    }
    verifyEmail(req, res) {
        userAuthModule.verifyEmail(req, res);
    }
}
exports.default = UserAuthService;
