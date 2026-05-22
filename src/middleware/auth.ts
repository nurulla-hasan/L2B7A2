import type { JwtPayload } from "jsonwebtoken";
import config from "../config";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import sendResponse from "../utility/sendResponse";
import type { NextFunction, Request, Response } from "express";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized access!!",
      });
    }

    const decoded = jwt.verify(
      token,
      config.ACCESS_SECRET as string,
    ) as JwtPayload;

    const userData = await pool.query(
      `
        SELECT id, name, email, role FROM users WHERE id=$1
        `,
      [decoded.id],
    );

    if (userData.rows.length === 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found!!",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Invalid or expired token!",
      errors: error,
    });
  }
};

export default auth;
