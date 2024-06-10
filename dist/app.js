import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.get("/", (req, res) => {
  res.status(200).send("Ready to serve");
});
// Middleware
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);
// Routes
app.use("/api/users", userRoutes);
export default app;
