import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";
import type { JwtPayload } from "jsonwebtoken";

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssuesFromDB(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues fetched successfully",
      data: result,
    });
  } catch (error) {
    const statusCode =
      error instanceof Error &&
      (error.message === "Invalid sort value" ||
        error.message === "Invalid issue type" ||
        error.message === "Invalid issue status")
        ? 400
        : 500;
    sendResponse(res, {
      statusCode: statusCode,
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      errors: error,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await issueService.getSingleIssueFromDB(id as string);

    if (!result) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue fetched successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      errors: error,
    });
  }
};

const createIssue = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized access!!",
      });
    }

    const result = await issueService.createIssueIntoDB(
      req.body,
      Number(req.user.id),
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      errors: error,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issueService.updateIssueIntoDB(
      id as string,
      req.body,
      req.user as JwtPayload,
    );

    if (!result) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error) {
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message === "Issue not found") {
        statusCode = 404;
      } else if (
        error.message === "Forbidden access" ||
        error.message === "Contributor cannot update issue status"
      ) {
        statusCode = 403;
      } else if (
        error.message === "Only open issues can be updated by contributor"
      ) {
        statusCode = 409;
      } else if (
        error.message === "Invalid issue type" ||
        error.message === "Invalid issue status" ||
        error.message ===
          "Title must be less than or equal to 150 characters" ||
        error.message === "Description must be at least 20 characters"
      ) {
        statusCode = 400;
      }
    }

    sendResponse(res, {
      statusCode,
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      errors: error,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.deleteIssueFromDB(id as string);

    if (!result) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      errors: error,
    });
  }
};

export const issueController = {
  getAllIssues,
  getSingleIssue,
  createIssue,
  updateIssue,
  deleteIssue,
};
