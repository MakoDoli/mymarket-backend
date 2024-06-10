import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

export default class UserAuthModule {
  constructor() {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      throw new Error(
        "SUPABASE_JWT_SECRET is not defined in environment variables"
      );
    }
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true,
      // maxAge: 1000000,
      // signed: true,
    });
    res.json({ token });
  }

  async signUp(req: Request, res: Response) {
    const { email, password } = req.body;
    console.log(email, password);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await prisma.user.create({
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
  }

  async resetPassword(req: Request, res: Response) {
    const { email, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    res.json({ message: "Password reset successful" });
  }
}
