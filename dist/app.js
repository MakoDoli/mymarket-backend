import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
const app = express();
app.get("/", (req, res) => {
  res.status(200).send("Ready to serve");
});
// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
// Routes
app.use("/api/users", userRoutes);
export default app;
