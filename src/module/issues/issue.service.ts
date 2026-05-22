
import { pool } from "../../db";

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

export const issueService = {
  getAllIssuesFromDB,
  getSingleIssueFromDB,
};
