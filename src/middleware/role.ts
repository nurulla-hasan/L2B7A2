import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utility/sendResponse";
import type { TRole } from "../types/users.type";

const role = (...roles: TRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized access!!",
      });
    }

    if (!roles.includes(req.user.role)) {
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "Forbidden access!!",
      });
    }
    next();
  };
};

export default role;
