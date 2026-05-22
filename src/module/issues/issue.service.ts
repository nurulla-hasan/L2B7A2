import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";
import type {
  TCreateIssuePayload,
  TIssueQuery,
  TUpdateIssuePayload,
} from "./issue.type";

const getAllIssuesFromDB = async (query: TIssueQuery) => {
  const { sort = "newest", type, status } = query;

  if (sort !== "newest" && sort !== "oldest") {
    throw new Error("Invalid sort value");
  }

  if (type && type !== "bug" && type !== "feature_request") {
    throw new Error("Invalid issue type");
  }

  if (
    status &&
    status !== "open" &&
    status !== "in_progress" &&
    status !== "resolved"
  ) {
    throw new Error("Invalid issue status");
  }

  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const orderBy = sort === "oldest" ? "ASC" : "DESC";

  const issueResult = await pool.query(
    `
      SELECT *
      FROM issues
      ${whereClause}
      ORDER BY created_at ${orderBy}
    `,
    values,
  );

  const issues = issueResult.rows;

  if (issues.length === 0) {
    return [];
  }

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const reporterResult = await pool.query(
    `
      SELECT id, name, role
      FROM users
      WHERE id = ANY($1::int[])
    `,
    [reporterIds],
  );

  const reporterMap = new Map(
    reporterResult.rows.map((reporter) => [reporter.id, reporter]),
  );

  const issuesWithReporter = issues.map((issue) => {
    const { reporter_id, ...issueData } = issue;

    return {
      ...issueData,
      reporter: reporterMap.get(reporter_id),
    };
  });

  return issuesWithReporter;
};

const getSingleIssueFromDB = async (id: string) => {
  if (!Number.isInteger(Number(id))) {
    throw new Error("Invalid issue id");
  }

  const issueResult = await pool.query(
    `
      SELECT *
      FROM issues
      WHERE id = $1
    `,
    [id],
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    return null;
  }

  const reporterResult = await pool.query(
    `
      SELECT id, name, role
      FROM users
      WHERE id = $1
    `,
    [issue.reporter_id],
  );

  const { reporter_id, ...issueData } = issue;

  return {
    ...issueData,
    reporter: reporterResult.rows[0],
  };
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
  if (!Number.isInteger(Number(id))) {
    throw new Error("Invalid issue id");
  }

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

  if (title && title.length > 150) {
    throw new Error("Title must be less than or equal to 150 characters");
  }

  if (description && description.length < 20) {
    throw new Error("Description must be at least 20 characters");
  }

  if (type && type !== "bug" && type !== "feature_request") {
    throw new Error("Invalid issue type");
  }

  if (
    status &&
    status !== "open" &&
    status !== "in_progress" &&
    status !== "resolved"
  ) {
    throw new Error("Invalid issue status");
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

const deleteIssueFromDB = async (id: string) => {
  if (!Number.isInteger(Number(id))) {
    throw new Error("Invalid issue id");
  }

  const result = await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    RETURNING *
  `,
    [id],
  );

  return result.rows[0];
};

export const issueService = {
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  createIssueIntoDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
};
