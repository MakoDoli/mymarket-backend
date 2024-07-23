"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userContoller_1 = require("../controllers/userContoller");
const validateRequest_1 = require("../middleware/validateRequest");
const userValidators_1 = require("../validators/userValidators");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = (0, express_1.Router)();
router.post('/signup', (0, validateRequest_1.validateRequest)(userValidators_1.signUpSchema), userContoller_1.signUp);
router.post('/signin', (0, validateRequest_1.validateRequest)(userValidators_1.signInSchema), userContoller_1.signIn);
router.post('/refresh', userContoller_1.requestNewToken);
router.post('/verify-email', (0, validateRequest_1.validateRequest)(userValidators_1.sendEmailSchema), userContoller_1.sendEmail);
router.get('/verify-email/:token', userContoller_1.verifyEmail);
router.post('/reset-password', verifyToken_1.default, (0, validateRequest_1.validateRequest)(userValidators_1.resetPasswordSchema), userContoller_1.resetPassword);
router.get('/check-auth', verifyToken_1.default, (_, res) => {
    res.status(200).json({ status: 'ok', message: 'User is authenticated', authenticated: true });
});
exports.default = router;
