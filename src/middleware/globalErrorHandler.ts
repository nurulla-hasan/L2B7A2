import type { NextFunction, Request, Response } from "express";
import config from "../config";

const globalErrorhandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: config.NODE_ENV === "development" && err instanceof Error ? err.stack : null,
  });
};


export default globalErrorhandler;