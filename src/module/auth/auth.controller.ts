import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserFromDB(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message.startsWith("Invalid credentials")
        ? 401
        : 500;

    sendResponse(res, {
      statusCode,
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      errors: error,
    });
  }
};

const signUpUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.signUpUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode:
        error instanceof Error && error.message === "User already exists"
          ? 409
          : error instanceof Error &&
              error.message === "Name, email and password are required!"
            ? 400
            : 500,
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      errors: error,
    });
  }
};

export const authController = {
  loginUser,
  signUpUser,
};
