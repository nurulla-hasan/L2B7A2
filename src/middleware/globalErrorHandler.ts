import type { NextFunction, Request, Response } from "express";
import config from "../config";

const globalErrorhandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const message = err instanceof Error ? err.message : "Internal Server Error";

  res.status(500).json({
    success: false,
    message,
    errors: config.NODE_ENV === "development" && err instanceof Error ? err.stack : null,
  });
};


export default globalErrorhandler;
