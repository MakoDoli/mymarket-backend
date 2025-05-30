import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
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
const transport = nodemailer.createTransport(realEmailtransportOptions);

type Props = {
  recipient: string;
  subject: string;
  token: string;
};

export const sendEmail = async ({ recipient, subject, token }: Props) => {
  const link = `http://localhost:3000/api/users/verify-email/${token}`;
  try {
    await transport.sendMail({
      from: process.env.MAIL_USER,
      to: recipient,
      subject,
      html: `<p>Click on the  <a href=${link}>link</a> to ${subject}<p>`,
    });
  } catch (err) {
    console.error('Failed to send email: ', err);
  }
};
