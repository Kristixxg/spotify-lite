import Router from "express";
import {
  getUserInfoAndUpdate,
  getUserLikedSongs,
} from "../controllers/UserController.js";
// import { userMiddleware } from "../middlewares/UserMiddleware.js";

export const userRouter = Router();

userRouter.put("/info/:id", getUserInfoAndUpdate);
userRouter.get("/songs/:id", getUserLikedSongs);

// userRouter.get("/:id", userController.getUserById);
// userRouter.post(
//   "/",
//   userMiddleware.validateUserName,
//   userMiddleware.validatePassword,
//   userController.postCreateUser
// );
// userRouter.put(
//   "/",
//   userMiddleware.validateUserName,
//   userMiddleware.validatePassword,
//   userController.putUpdateUser
// );
// userRouter.delete("/:id", userController.deleteUserById);
