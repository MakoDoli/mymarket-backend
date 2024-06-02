import app from "./app";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
