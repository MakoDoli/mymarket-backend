"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// import SMTPTransport from 'nodemailer/lib/smtp-transport';
// const transportOPtions: SMTPTransport.Options = {
//   host: process.env.MAIL_HOST,
//   port: 2525,
//   secure: false,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASSWORD,
//   },
// };
const realEmailtransportOptions = {
    service: 'gmail',
    port: 465,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
};
const transport = nodemailer_1.default.createTransport(realEmailtransportOptions);
const sendEmail = async ({ recipient, subject, token }) => {
    const link = `http://localhost:3000/api/users/verify-email/${token}`;
    try {
        await transport.sendMail({
            from: process.env.MAIL_USER,
            to: recipient,
            subject,
            html: `<p>Click on the  <a href=${link}>link</a> to ${subject}<p>`,
        });
    }
    catch (err) {
        console.error('Failed to send email: ', err);
    }
};
exports.sendEmail = sendEmail;
