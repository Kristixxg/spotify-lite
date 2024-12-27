import jwt from "jsonwebtoken";
export const generateToken = (id, username) => {
  const token = jwt.sign({ id, username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1hr",
  });

  return token;
};
