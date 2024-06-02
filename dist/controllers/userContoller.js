var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
// Sign-Up
export const signUp = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email, password);
    const hashedPassword = yield bcrypt.hash(password, 10);
    try {
      const user = yield prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
      // Send verification email logic here
      res.status(201).json({ message: "User created", user });
    } catch (error) {
      res.status(400).json({ error: "Couldn't create new user" });
    }
  });
// Sign-In
export const signIn = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = yield bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, "your_jwt_secret");
    res.json({ token });
  });
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
export const resetPassword = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const hashedPassword = yield bcrypt.hash(newPassword, 10);
    yield prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    res.json({ message: "Password reset successful" });
  });
