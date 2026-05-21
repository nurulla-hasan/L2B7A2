import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";

const generateToken = (payload: JwtPayload) => {
  const token = jwt.sign(
    payload as JwtPayload,
    config.ACCESS_SECRET as string,
    {
      expiresIn: "1d",
    },
  );


  return {token};
};

export default generateToken;
