import express, { type Application } from "express";
import cors from "cors";
import logger from "./middleware/logger";
import cookie from "cookie-parser";
import globalErrorhandler from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(cookie());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello From L2B7A2",
  });
});

app.use(globalErrorhandler);

export default app;
