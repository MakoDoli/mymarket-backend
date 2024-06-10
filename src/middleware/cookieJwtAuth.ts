import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest, CustomResponseType } from "../utils/types";
export const cookieJwtAuth = (
  req: CustomRequest,
  res: CustomResponseType,
  next: NextFunction
) => {
  const token = req.cookies.token;
  try {
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      throw new Error(
        "SUPABASE_JWT_SECRET is not defined in environment variables"
      );
    }
    const user = jwt.verify(token, secret);
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.status(400).json({ error: "No cookies sent" });
  }
};
