import { isAlphanumeric, isStrongPassword } from "validator";

export const validateUserName = (req, res, next) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  if (!isAlphanumeric(username)) {
    return res.status(400).json({ message: "Username must be alphanumeric" });
  }
  if (username.length < 3) {
    return res
      .status(400)
      .json({ message: "Username length must be greater than 3" });
  }
  next();
};

export const validatePassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  if (!isStrongPassword(password)) {
    return res.status(400).json({ message: "Password must be strong" });
  }
  next();
};
