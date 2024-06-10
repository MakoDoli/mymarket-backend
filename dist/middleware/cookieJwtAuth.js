import jwt from "jsonwebtoken";
export const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const secret = process.env.SUPABASE_JWT_SECRET;
        if (!secret) {
            throw new Error("SUPABASE_JWT_SECRET is not defined in environment variables");
        }
        const user = jwt.verify(token, secret);
        req.user = user;
        next();
    }
    catch (err) {
        res.clearCookie("token");
        return res.status(400).json({ error: "No cookies sent" });
    }
};
