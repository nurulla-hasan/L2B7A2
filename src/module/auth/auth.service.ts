import { pool } from "../../db";
import bcrypt from "bcrypt";
import generateToken from "../../utility/generateToken";
import type { TLoginUser, TSignUpUser } from "./auth.type";

const loginUserFromDB = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const userdata = await pool.query(
    `
           SELECT * FROM users WHERE email=$1
           `,
    [email],
  );

  if (userdata.rows.length === 0) {
    throw new Error("Invalid credentials!");
  }

  const user = userdata.rows[0];

  const matchpassword = await bcrypt.compare(password, user.password);
  if (!matchpassword) {
    throw new Error("Invalid credentials");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const { token } = generateToken(jwtPayload);

  const returnUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return { token, user: returnUser };
};

const signUpUserIntoDB = async (payload: TSignUpUser) => {
  const { name, email, password, role } = payload;
  const userRole = role || "contributor";

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required!");
  }

  const existingUser = await pool.query(
    `
    SELECT id FROM users WHERE email = $1
  `,
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userdata = await pool.query(
    `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at
  `,
    [name, email, hashedPassword, userRole],
  );

  return userdata.rows[0];
};

export const authService = {
  loginUserFromDB,
  signUpUserIntoDB,
};
