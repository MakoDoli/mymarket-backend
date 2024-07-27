"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModule_js_1 = __importDefault(require("../modules/userModule.js"));
const userAuthModule = new userModule_js_1.default();
class UserAuthService {
    login(req, res, next) {
        userAuthModule.login(req, res, next);
    }
    signup(req, res, next) {
        userAuthModule.signUp(req, res, next);
    }
    signOut(req, res, next) {
        userAuthModule.signOut(req, res, next);
    }
    requestNewToken(req, res, next) {
        userAuthModule.requestNewToken(req, res, next);
    }
    resetPassword(req, res, next) {
        userAuthModule.resetPassword(req, res, next);
    }
    sendEmail(req, res, next) {
        userAuthModule.sendEmail(req, res, next);
    }
    verifyEmail(req, res, next) {
        userAuthModule.verifyEmail(req, res, next);
    }
}
exports.default = UserAuthService;
