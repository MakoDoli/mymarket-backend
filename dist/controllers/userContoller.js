"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.verifyEmail = exports.resetPassword = exports.signUp = exports.signIn = void 0;
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
//JWT_SECRET="Tqyu1k2g+ZO+IU/DMWUoSzrHSvXYaLtC6OpTiOIc7ZdzajoQZxPbS/m8S7FOKfv0BLi4b8wHk1f8fIXTNEQHHw=="
// Sign-Up
// export const signUp = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   console.log(email, password);
//   const hashedPassword = await bcrypt.hash(password, 10);
//   try {
//     const user = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//       },
//     });
//     // Send verification email logic here
//     res.status(201).json({ message: "User created", user });
//   } catch (error) {
//     res.status(400).json({ error: "Couldn't create new user" });
//   }
// };
// Sign-In
// export const signIn = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) {
//     return res.status(401).json({ error: "Invalid credentials" });
//   }
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return res.status(401).json({ error: "Invalid credentials" });
//   }
//   const secret = process.env.SUPABASE_JWT_SECRET;
//   if (!secret) {
//     throw new Error(
//       "SUPABASE_JWT_SECRET is not defined in environment variables"
//     );
//   }
//   const token = jwt.sign({ userId: user.id }, secret);
//   res.json({ token });
// };
// Verify Email
// export const verifyEmail = async (req: Request, res: Response) => {
//   const { token } = req.params;
//   try {
//     const decoded = jwt.verify(token, "your_email_verification_secret") as {
//       userId: number;
//     };
//     const user = await prisma.user.update({
//       where: { id: decoded.userId },
//       data: { emailVerified: true },
//     });
//     res.json({ message: "Email verified" });
//   } catch (error) {
//     res.status(400).json({ error: "Invalid token" });
//   }
// };
// Reset Password
// export const resetPassword = async (req: Request, res: Response) => {
//   const { email, newPassword } = req.body;
//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) {
//     return res.status(400).json({ error: "User not found" });
//   }
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   await prisma.user.update({
//     where: { email },
//     data: { password: hashedPassword },
//   });
//   res.json({ message: "Password reset successful" });
// };
