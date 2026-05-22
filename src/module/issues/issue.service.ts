import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";
import type { TCreateIssuePayload, TUpdateIssuePayload } from "./issue.type";

const getAllIssuesFromDB = async () => {
  // const { sort, type, status } = req.query;

  const result = await pool.query(`SELECT * FROM issues`);

  return result.rows;
};

const getSingleIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [id],
  );

  return result.rows[0];
};

const createIssueIntoDB = async (
  payload: TCreateIssuePayload,
  reporterId: number,
) => {
  const { title, description, type } = payload;

  if (!title || !description || !type) {
    throw new Error("Title, description and type are required");
  }

  if (title.length > 150) {
    throw new Error("Title must be less than or equal to 150 characters");
  }

  if (description.length < 20) {
    throw new Error("Description must be at least 20 characters");
  }

  if (type !== "bug" && type !== "feature_request") {
    throw new Error("Invalid issue type");
  }

  const result = await pool.query(
    `
        
        INSERT INTO issues (title, description, type, reporter_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        
        `,
    [title, description, type, reporterId],
  );

  return result.rows[0];
};

const updateIssueIntoDB = async (
  id: string,
  payload: TUpdateIssuePayload,
  user: JwtPayload,
) => {
  const { title, description, type, status } = payload;

  const issueResult = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
  `,
    [id],
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  const isMaintainer = user.role === "maintainer";
  const isOwner = issue.reporter_id === user.id;

  if (!isMaintainer) {
    if (!isOwner) {
      throw new Error("Forbidden access");
    }

    if (issue.status !== "open") {
      throw new Error("Only open issues can be updated by contributor");
    }

    if (status) {
      throw new Error("Contributor cannot update issue status");
    }
  }

  const result = await pool.query(
    `
    UPDATE issues
    SET
    title = COALESCE($1, title),
    description = COALESCE($2, description),
    type = COALESCE($3, type),
    status = COALESCE($4, status),
    updated_at = NOW()
    WHERE id = $5
    RETURNING *
  `,
    [title, description, type, status, id],
  );

  return result.rows[0];
};

export const issueService = {
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  createIssueIntoDB,
  updateIssueIntoDB,
};
