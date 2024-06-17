"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODES = void 0;
exports.ERROR_CODES = {
    wrongUser: `User  not found`,
    wrongPassword: 'Invalid user or password',
    noSecret: 'JWT_SECRET is not defined in environment variables',
    newUserFail: "Couldn't create new user",
    invalidToken: 'Invalid token',
};
