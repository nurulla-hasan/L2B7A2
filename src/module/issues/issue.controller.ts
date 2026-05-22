import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";

const getAllIssues = async ( req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssuesFromDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues fetched successfully",
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

export const issueController = {
  getAllIssues,
  getSingleIssue,
};
